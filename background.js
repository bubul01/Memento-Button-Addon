"use strict";

/*
 Version

 1.1
 - add menu to get memento page from page, link, frame, tab
 
 1.2
 - Compatible with Google Chrome

 1.2.1
 - added menu to view image archive when click on a picture
  
 1.2.2
 - changed shortname 
 
 1.2.3
 - changed version number error

*/

let brw = null;



function init()
{
    let brw;

    try {
        brw = browser;
        if (!browser) brw = chrome;
    }
    catch (e) {
        brw = chrome;
    }
    finally
    {
        return brw;
    }

    
}

function OnError(error)
{
    console.error("Memento Extension Error: "+error);
}

function BtnClick(tab,info,forceurl) {

    let url = tab.url;

    if (forceurl) url = forceurl;

    

    let today = new Date();
    
    let year = today.getUTCFullYear().toString();

    let month = today.getUTCMonth()+1;
    if (month < 10) month = "0" + month.toString();

    let day = today.getUTCDate();
    if (day < 10) day = "0" + day.toString();

    let hour = today.getUTCHours();
    if (hour < 10) hour = "0" + hour.toString();

    let min = today.getUTCMinutes();
    if (min < 10) min = "0" + min.toString();

    // sec = today.getUTCSeconds();
    //  if (sec < 10) sec = "0" + sec;
   
    let sec = "00";

    let goto_url = "http://timetravel.mementoweb.org/list/" + year + month + day +
        hour + (min-2) + sec+ "/" + url;


    brw.tabs.create({
        url:  goto_url
    });
}

function create_menus() {

    function make_menu(menu)
    {

        // if firefox
        if (brw===chrome)
        {
            delete menu.icons;
        }

        brw.contextMenus.create(menu);
    } 



    make_menu({
        id: "view_archive",
        icons: { 20: "icons/icon_20.png" },
        title: "Page: View Archived Versions",
        contexts: ["browser_action", "page", "frame"]
    });


    if (brw !== chrome) {
        make_menu({
            id: "view_archive_tab",
            icons: { 20: "icons/icon_20.png" },
            title: "Tab: View Archived Versions",
            contexts: ["tab"]
        });
    }

    make_menu({
        id: "view_archive_tab",
        id: "view_archive_frame",
        icons: { 20: "icons/icon_20.png" },
        title: "Frame: View Archived Versions",
        contexts: ["frame"]
    });

  
    make_menu({
        id: "view_archive_link",
        icons: { 20: "icons/icon_20.png" },
        title: "Link: View Archived Versions",
        contexts: ["link"]
    });

    make_menu({
        id: "view_archive_image",
        icons: { 20: "icons/icon_20.png" },
        title: "Image: View Archived Versions",
        contexts: ["image"]
    });



    brw.contextMenus.onClicked.addListener(menus_onclicked);
}

function menus_onclicked(info, tab)
{

    switch (info.menuItemId) {

        case "view_archive":
        case "view_archive_tab":
            BtnClick(tab, info);
            break;


        case "view_archive_frame":
            BtnClick(tab, info, info.frameUrl);
            break;

        case "view_archive_image":
            BtnClick(tab, info, info.srcUrl);


        case "view_archive_bookmark":
          //  BtnClick(tab, info, info.linkUrl);
            break;


        case "view_archive_link":
            BtnClick(tab,info,info.linkUrl) ;
            break;

    }

}



brw = init();
create_menus();



brw.browserAction.setTitle({ title: "View Page Archived Versions and History on Mementoweb" });
brw.browserAction.onClicked.addListener(BtnClick);



