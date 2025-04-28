> ⚠️ **This repository is archived and kept for reference purposes only.**  
> It is no longer maintained and will not receive updates or support.

## Getting Started

We provide a sample app that produces and consumes messages to/from Kafka using Node.js that you can deploy on App Platform. These steps will get this sample application running for you using App Platform.

**Note: Following these steps may result in charges for the use of DigitalOcean services.**

### Requirements

* You need a DigitalOcean account. If you don't already have one, you can sign up at https://cloud.digitalocean.com/registrations/new.
* You need a running Kafka instance. If you don't already have one, you can create one at https://cloud.digitalocean.com/databases.

## Deploying the App

[Fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) this GitHub repository to your account so that you have a copy of it stored to the cloud. Click the **Fork** button in the GitHub repository and follow the on-screen instructions.

After forking the repo, you should now be viewing this README in your own GitHub org (e.g. `https://github.com/<your-org>/sample-nodejs-kafka`). To deploy the new repo, make a couple of changes to the `.do/app.yaml` file.

1. Update the environment variables under `envs` -> `value` to point to your Kafka instance.
2. Set your repo path under `services` -> `github` -> `repo`.

Once the above changes are made, run `doctl apps create --spec .do/app.yaml`.

1. Go to https://cloud.digitalocean.com/apps, and select your app. You should see a "Building..." progress indicator. You can click **View Logs** to see more details of the build.
1. It can take a few minutes for the build to finish, but you can follow the progress in the **Deployments** tab.
1. Once the build completes successfully, right click on the **Live App** link in the header, click "Copy Link Address" and run `curl -X POST https://xxx.ondigitalocean.app/produce --data "hello world!"` in a terminal. Go to the Runtime Logs of the consumer and you should now see message consumed logs.

### Making Changes to Your App

If you followed the steps to fork the repo and used your own copy when deploying the app, you can push changes to your fork and see App Platform automatically re-deploy the update to your app. During these automatic deployments, your application will never pause or stop serving request because App Platform offers zero-downtime deployments.

### Learn More

You can learn more about the App Platform and how to manage and update your application at https://www.digitalocean.com/docs/app-platform/.

## Deleting the App

When you no longer need this sample application running live, you can delete it by following these steps:
1. Visit the Apps control panel at https://cloud.digitalocean.com/apps.
2. Navigate to the sample app.
3. In the **Settings** tab, click **Destroy**.

**Note: If you do not delete your app, charges for using DigitalOcean services will continue to accrue.**
