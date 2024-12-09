//Youtube API: 


function onOpen() {
 const ui = SpreadsheetApp.getUi();
 ui.createMenu('YouTube Comments')
   .addItem('Fetch Comments', 'fetchAndCompareComments')
   .addToUi();
}


const API_KEY = 'ZZZZZZZXXXX; // Replace with your API key
const VIDEO_ID = ZZZZZZXXXXX; // Replace with the video ID
const sheetName = 'Sheet1'; // Replace with the name of your sheet


function fetchAndCompareComments() {
 let pageToken = ''; // Initialize pageToken


 while (true) {
   const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${VIDEO_ID}&key=${API_KEY}&pageToken=${pageToken}`;


   const response = UrlFetchApp.fetch(url);
   const data = JSON.parse(response.getContentText());


   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
   const existingComments = sheet.getDataRange().getValues().map(row => row[2]); // Assuming comments are in the third column
   const existingUsernames = sheet.getDataRange().getValues().map(row => row[1]); // Assuming usernames are in the second column


   const malaysiaTimeZone = Session.getScriptTimeZone(); // Get Malaysia timezone


   data.items.forEach(item => {
     const commentSnippet = item.snippet.topLevelComment.snippet;
     const comment = commentSnippet.textDisplay;
     const username = commentSnippet.authorDisplayName;


     if (!existingComments.includes(comment) && !existingUsernames.includes(username)) {
       const commentDateTimeString = commentSnippet.publishedAt;
       const translatedComment = LanguageApp.translate(comment, '', 'en'); // Translate comment to English


       if (typeof commentDateTimeString === 'string' && commentDateTimeString.includes('T') && commentDateTimeString.includes('Z')) {
         const dateTimeUTC = new Date(commentDateTimeString);
         const formattedDate = Utilities.formatDate(dateTimeUTC, malaysiaTimeZone, 'dd/MM/yyyy HH:mm:ss');


         sheet.appendRow([formattedDate, username, comment, translatedComment]);
       }
     }
   });


   if (data.nextPageToken) {
     pageToken = data.nextPageToken; // Update pageToken for the next page
   } else {
     break; // Exit the loop if there are no more pages
   }
 }
}

