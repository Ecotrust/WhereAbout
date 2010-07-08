READ ME for Oregon Charter Survey:

///////////////  INSTALLING THE SURVEY SOFTWARE ////////////////////////

Step 1 - get the installer:
    Currently kept at \\daryl\gis\projects\SpatialWebSurveyTool\OR-Intercept-NonConSurvey\Installers                        ----REVIEW----
    Copy it somewhere on your machine.
    
Step 2 - Install it:
    just run the exe, choose a directory you'd like to install it to, and it takes care of the rest.
    
    
///////////////  TAKING/GIVING THE SURVEY ////////////////////////

Step 1 - Run it from your start menu (under all programs)
    
    It will open in your default browser.  This should work with IE7+, FireFox 1.5+, Safari 3+, Opera 9+, Google Chrome 2+.        ----REVIEW----
    The address bar should read  http://127.0.0.1:8001/accounts/login/?next=/
    
Step 2 - Log in
        NOTE: for creating a login id, see the section on "CREATING A USER"
    enter the desired username and password (either the user you created for the interview, or your admin account)
    
    ALTERNATE:
        If logged in as an admin, from the admin menu select 'List of user accounts'
        Find the user you want to answer questions for and select 'Start/continue survey for {USER}'
            This can be used to restart a non-staff user's survey without deleting the user and creating them from scratch.
    
Step 3 - Answer the questions

    The questions are broken up into three groups: 'Main Questions', 'Charter Owners', 'Charter Operators'
    You will answer them in that order
    You must 'finalize' each group before moving on to the next 
        (i.e. 'Main Questions' must be finalized before links for 'Charter Owners' will be available)
    A group that is finalized may be reopened later for editing until the survey is finalized
    You cannot finalize the survey until all groups are completed
    'Charter Owner' is optional, and may be skipped entirely
    
Step 4 - Enter user data into the map tool
        NOTE: For detailed instructions, see 'USING THE MAP TOOL'
    Map out the Activity Areas for the Charter Operator you're interviewing
    
Step 5 - Finalize the interview

    If you have completed all of the required sections, the main menu should now have 'Finalize Interview' available as a link at the bottom
    For normal (non-staff) users, this will lock the interview from further editing
        If something needs to be changed, the survey must be started over again (see 'OTHER ADMIN OPTIONS')

        
///////////////  LOGGING IN AS AN ADMINISTRATOR  ////////////////////////
        
Step 1 - Log in as admin

    If you are an admin, you should have been given a username and password with admin privileges.
    Once the tool is running, you have two login options:
    
    STANDARD: 
        Login to the normal page (http://127.0.0.1:8001/accounts/login/?next=/) with your admin account 
        Click on the 'Site Admin' link in the header
            NOTE: this link will not show for non-admin users
        
    ALTERNATE: 
        type 'http://127.0.0.1:8001/admin/' into your browser's address bar without the quotes
        log in with your administrator username and password
        
        
///////////////  CREATING A USER ////////////////////////

Step 1 - Log in as admin
    
    See LOGGING IN AS AN ADMINISTRATOR
    
Step 2 - click on 'Create new user account'

Step 3 - Enter the user's id

    Enter a unique username
    Enter a password of your choosing
    Retype the password for verification
    
Step 4 - save the new user account

    Click on the 'Save' button
    Scroll to the bottom of the next page and click on the 'Save' button
    

///////////////  USING THE MAP TOOL ////////////////////////

-------NON PANEL FEATURES-------

Go To Main Menu

    At any point during the mapping tool you may click on this to quit and return to the main menu
    anything not saved in the mapping tool will be lost
    
Map Layer Selector

    Allows you to change which map you're viewing as you draw your Activity Areas
    
Navigation Buttons
    
    Allow for moving and zooming of the map
    
Latitude/Longitude Coordinates

    The coordinates your cursor is pointing at are always displayed and being updated in the lower-left corner
    

--------Panels----------    

Introduction
    
    Only tells you that the 'Go To Main Menu' button takes you to the main menu
    
1. Select Activity

    click on one (1) of the activities in the box (one entry for each you selected in the questions)
    Click 'Continue >>'
    
2. Navigate

    use the blue buttons to zoom into the map, and move it where you want to draw
        NOTES:
            It's easier to be more accurate with your drawings the more you zoom in
            You may still zoom and move the map later, you don't have to get it right now
            Google-style map controls (zooming with the mouse wheel, click-and-drag, etc...) are available to use while in this panel
            Google-style map controls WILL NOT be available in some panels        ----REVIEW---- (Should we even address the Google-style controls?)
            
3. Draw Introduction    

    1 single click on the map begins your drawing by dropping your first point
    Each single-click afterwards drops a new point
    1 double-click finishes drawing
        NOTES:
            Shapes cannot cross over thmselves
            Shapes cannot be too big
                If an activity area is too large to drawn, break it up into multiple shapes
            A shape can be cancelled and restarted using the 'Cancel Area' button at any time
            The map navigation buttons still work, clicking on them will not drop a point
            The Google-style navigation controls will not work, as they contradict the drawing controls
            This panel will not show if you already have a shape drawn (See 3. Draw)
            A Shape must have AT LEAST 3 points (no line or point geometries allowed)
            
Satisfied?

    YES: keep shape
    NO: Delete shape and start over
    
Boundary Information

    Enter in English descriptions of the bounds of the Activity Area, this will help us be more accurate with complex shapes
        NOTE: The shape drawn in the last few steps isn't saved until you finish this panel
        
Draw Another?

    'Draw Another' - Go to '3. Draw'
    'Allocate Pennies' - Finish drawing and go to '4. Penny Introduction'
    
3. Draw

    Just like '3. Draw Introduction', clicking on the map will draw a new shape
    The instructions from '3. Draw Introduction' are available by clicking on the triangle button next to 'How do I draw, again?'
    'Your {ACTIVITY} Activity Areas' Box:
        Each shape will have a row in this table
        Click 'Remove' to delete that shape
        Click 'Zoom To' to focus the map on that shape
        Click anywhere else on the row to highlight the shape
        Click 'Show All' to center the map on all shapes at once
    Click 'Continue >>' to move on to '4. Penny Introduction'
    
4. Penny Introduction

    Explains the meaning of pennies, and how to use the next panel
    
5. Penny Allocation

    'Your {ACTIVITY} Activity Areas' Box:
        Each shape will have a row in this table
        Click 'Edit Pennies' to add/change the pennies allocated to that shape
        Click 'Zoom To' to focus the map on that shape
        Click anywhere else on the row to highlight the shape
        Click 'Show All' to center the map on all shapes at once
    Remaining: how many pennies (of 100) haven't been allocated to an Activity Area
    Status: Incomplete until all 100 pennies are allocated to a shape, and all shapes have at least 1 penny
    NOTE:
        The 'Continue >>' button is disabled until your status is complete
        
Activity Complete

    Completed Activity: list of activities you've drawn areas for and successfully allocated pennies to
    Incomplete Activity: All activities you have indicated that this operator partakes in that you have not completed in the mapping tool
    Select Activity: Return to '1. Select Activity' to choose another activity to map out
    'Finish': Quit mapping tool and return to the Main Menu (Same as 'Go To Main Menu')

    
///////////////  IMPORTING/EXPORTING SURVEY DATA ////////////////////////

Step 1 - Log in as an administrator

    See LOGGING IN AS AN ADMINISTRATOR
    
Step 2 - Click on 'Export/Import surveys'

TO EXPORT:
    Click on the 'Export Surveys' button to create a data file (JSON) of all completed surveys.
    Select 'Save File' in the dialog box and then click 'OK'
    The data will now be in your default download folder
        NOTE: By default, this should be:   C:\users\{YOUR WINDOWS USERNAME}\My Documents\Downloads                     ----REVIEW----
        The file will be called {YOUR SURVEY ADMIN USERNAME}_{YEAR-MONTH-DAY}.json
    Copy your data to \\daryl\gis\projects\SpatialWebSurveyTool\OR-Intercept-NonConSurvey\exported_survey_data          ----REVIEW----
        If you can't do that, email it to fish@ecotrust.org                                                             ----REVIEW----
        
TO IMPORT:
    Save the json file somewhere you can find it, or 
        leave it in \\daryl\gis\projects\SpatialWebSurveyTool\OR-Intercept-NonConSurvey\exported_survey_data            ----REVIEW----
    Click on the 'Browse...' button to locate it
    Click on the 'Import Surveys' button
    The next screen should tell you that the fixture was successfully loaded into the database
        

///////////////  OTHER ADMIN OPTIONS ////////////////////////

List User Accounts:
    Displays a list of all users in the database for your computer
    Has links to either start/continue or delete a survey for each

Start/Continue a survey:
    Same as 'List User Accounts'
    Allows you to start/continue a survey for each user
        Just click on the link and it will start you up in that survey
    
Delete a user account and its survey responses:
    Same as 'List User Accounts'
    Allows you to delete a survey for each user
        Just click the link, verify that it will delete waht you want, then click 'Yes, I'm sure' and it will delete the data


///////////////  UNINSTALLING THE SURVEY SOFTWARE ////////////////////////

To uninstall, select 'Uninstall Desktop Survey Tool' from START->All Programs->Desktop Survey Tool