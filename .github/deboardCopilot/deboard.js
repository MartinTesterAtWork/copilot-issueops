const fs = require("fs");
const { exit } = require("process");

/**
 *
 * @param {*} github
 * @param {import("@actions/core")} core
 * @returns
 */
async function getSeats(github, core, context) {
  var seats = [];
  var page = 1;
  var res;
  try {
    do {
      res = await github.rest.copilot.listCopilotSeats({
        org: context.repo.owner,
        per_page: 100,
        page: page,
      });
      page++;
      seats = seats.concat(res.data.seats);
    } while (seats.length < res.data.total_seats);
  } catch (error) {
    core.setFailed(error);
    delete error.request.request;
    core.setOutput(
      "ERROR",
      `Error while getting seats:
      \`\`\`json
      ${JSON.stringify(error, null, 2)}
      \`\`\`
      `,
    );
    exit(1);
  }
  core.info("Found seats: " + seats.length);
  return seats;
}

/**
 *
 * @param {import("@actions/core")} core
 * @param {*} github
 */
async function main(github, core, context) {
  // Read the seats.json file
  const seats = await getSeats(github, core, context);

  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const toExpel = [];

  // Iterate over the seats
  core.debug("Seats are (first 3 seats) " + JSON.stringify(seats.slice(0, 3)));
  const today = new Date();
  seats.forEach((seat) => {
    const lastActivity = seat.last_activity_at // if no activity at all, take the date of the seat's creation
      ? new Date(seat.last_activity_at) // will be null if the user has never used the product
      : new Date(seat.updated_at); //last modification of the seat (roughly the last onboarding), guaranteed to exist
    core.debug(
      `Inspecting ${seat.assignee.login}. Last activity: ${seat.last_activity_at}, last updated: ${seat.updated_at}. Assuming last activity at ${lastActivity}`,
    );
    const inactiveDays = (today - lastActivity) / MS_PER_DAY;
    core.debug(`Inactive days: ${inactiveDays}`);
    if (inactiveDays > process.env.MAX_DAYS_INACTIVE) {
      core.info(
        `Expelling ${seat.assignee.login} due to inactivity of ${inactiveDays} days`,
      );
      toExpel.push(seat.assignee.login);
    }
  });

  // remove license from users
  let validUsersToExpel = [];
  if (toExpel.length > 0) {
    // Check which users are still members of the organization
    
    for (const username of toExpel) {
      try {
        await github.rest.orgs.getMembershipForUser({
          org: context.repo.owner,
          username: username,
        });
        // If we get here, the user exists in the organization
        validUsersToExpel.push(username);
      } catch (error) {
        if (error.status === 404) {
          // User no longer exists in the organization
          core.warning(`User ${username} is no longer a member of the organization, skipping`);
        } else {
          // Other errors checking membership - include user to attempt removal anyway
          validUsersToExpel.push(username);
          core.warning(`Could not verify membership for ${username}, will attempt removal anyway`);
        }
      }
    }

    try {
      await github.rest.copilot.cancelCopilotSeatAssignmentForUsers({
        org: context.repo.owner,
        selected_usernames: validUsersToExpel,
      });
    } catch (error) {
      core.setFailed(error);
      delete error.request.request;
      core.setOutput(
        "ERROR",
        `Error while expelling users:
      \`\`\`json
      ${JSON.stringify(error, null, 2)}
      \`\`\`
      `,
      );
    }
  } else {
    console.info("No users to expel");
  }

  //prepare the output
  //append each login with @, and join with a comma
  const toExpelAt = validUsersToExpel.map((login) => `@${login}`).join(", ");
  core.setOutput("deboarded", toExpelAt);
}

module.exports = {
  deboard: async (github, core, context) => main(github, core, context),
};