# jquery.ui.chatbox-extended

# php-long-poll
jQuery UI Chatbox Plugin (extended) loaded via RequireJS. 

## Usage

Load jQuery, jQuery-ui, jQuery.ui.chatbox.js and jQuery.ui.chatbox.css in index.html and add a placeholder div tag for chatbox.

**app.js**
```javascript
define(['jquery', 'jquery.ui.chatbox'], function($, ChatBox) {
        var App = function (chatBoxSelector) {
            chatBox = $(chatBoxSelector).chatbox({
                id: chatBoxSelector,
                title: "Notification",
                hidden: false,
                offset: 20,
                width: 247,
                loader: self,
            });

	    chatBox.chatbox("option", "boxManager").addMessage(<notificationTitle>, <notificationId>, <notificationText>, <Timestamp>, <readOrUnreadDefaultValue>, <chatBoxTitleWhenNotificationArrives>);
        };


	// Implement mark notifiaction as read 
	function markNotificationAsRead = function() {
	}
    });

```

### References

* https://github.com/dexterpu/jquery.ui.chatbox
