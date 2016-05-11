# Filament-Control-using-Amazon-Echo
This project is designed to control Wig Wag Filaments using Amazon Echo

# Setup
To run this skill you need to do two things. The first is to deploy the example code in lambda, and the second is to configure the Alexa skill to use Lambda.

# AWS Lambda Setup
1.	Go to the AWS Console and click on the Lambda link. Note: ensure you are in us-east or you won't be able to use Alexa with Lambda.
2.	Click on the Create a Lambda Function or Get Started Now button.
3.	Skip the blueprint
4.	Name the Lambda Function "wigwag".
5.	Select the runtime as Node.js
6.	Go to the the src directory, select all files(index.js, AlexaSkill.js and all files from mqtt folder) and then create a zip file, make sure the zip file does not contain the src directory itself, otherwise Lambda function will not work.
7.	Select Code entry type as "Upload a .ZIP file" and then upload the .zip file to the Lambda
8.	Keep the Handler as index.handler (this refers to the main js file in the zip).
9.	Create a basic execution role and click create.
10.	Leave the Advanced settings as the defaults.
11.	Click "Next" and review the settings then click "Create Function"
12.	Click the "Event Sources" tab and select "Add event source"
13.	Set the Event Source type as Alexa Skills kit and Enable it now. Click Submit.
14.	Copy the ARN from the top right to be used later in the Alexa Skill Setup.

# Alexa Skill Setup
1.	Go to the Alexa Console and click Add a New Skill.
2.	Set "Wig Wag" for the skill name and "wig wag" as the invocation name, this is what is used to activate your skill. For example you would say: "Alexa, Ask to turn on the lights."
3.	Select the Lambda ARN for the skill Endpoint and paste the ARN copied from above. Click Next.
4.	Copy the custom slot types from the customSlotTypes folder. Each file in the folder represents a new custom slot type. The name of the file is the name of the custom slot type, and the values in the file are the values for the custom slot.
5.	Copy the Intent Schema from the included IntentSchema.json.
6.	Copy the Sample Utterances from the included SampleUtterances.txt. Click Next.
7.	Go back to the skill Information tab and copy the appId. Paste the appId into the index.js file for the variable APP_ID, then update the lambda source zip file with this change and upload to lambda again, this step makes sure the lambda function only serves request from authorized source.
8.	You are now able to start testing your sample skill! You should be able to go to the Echo webpage and see your skill enabled.
9.	In order to test it, try to say some of the Sample Utterances from the Examples section below.
10.	Your skill is now saved and once you are finished testing you can continue to publish your skill.

# DeviceJS Server
1. Copy the server javascript file from the devicejs local server folder to your machince where devicejs is installed.
2. Plug in the border router.
3. Start devicejs in one terminal using "devicejs start".
4. Run devicejs in another terminal using "sudo devicejs run ./"
5. Once the above two have started, run the server using the code as "sudo devicejs run <file path>/wigwag_bulbs.js"
6. The commands received from Alexa can be seen on this terminal.

#Example user interactions:
#One-shot model:
1. User:  "Alexa, ask wig wag to turn on the lights at 11:30 AM on Friday."
2. Alexa: "Turning the lights on ..."

#Dialog model:
1. User:  "Alexa, open Wig Wag."
2. Alexa: "Welcome to Wig Wag."
3. User:  "Set mood to red filament at 6:00 PM today."
4. Alexa: "Changing the mood..."

