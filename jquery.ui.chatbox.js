/* -----------------------------------------------
/* Author : Rated Crypto - ratedcrypto@gmail.com
/* MIT license: http://opensource.org/licenses/MIT
/* ----------------------------------------------- */
define(['jquery', 'jquery-ui'], function($) {
    $.widget("ui.chatbox", {
        options: {
            id: null, //id for the DOM element
            title: null, // title of the chat box
            user: null, // can be anything associated with this chat box
            hidden: false,
            offset: 0, // relative to right edge of the browser window
            width: 300, // width of the chat box
            loader: null, // loader who loaded this chat box
            messageSent: function (id, user, msg) {
            },
            boxClosed: function (id) {
            }, // called when the close icon is clicked
            boxMinimized: function (id) {
            }, // called when the minimized icon is clicked
            boxManager: {
                // thanks to the widget factory facility
                // similar to http://alexsexton.com/?p=51
                init: function (elem) {
                    this.elem = elem;
                },
                addMessage: function (title, id, msg, timestamp, read, boxTitle) {
                    var self = this;
                    var box = self.elem.uiChatboxLog;
                    var e = document.createElement('div');
                    box.prepend(e);
                    $(e).hide();
                    var systemMessage = false;
                    // Title.
                    if (title) {
                        var titleElement = document.createElement("span");
                        $(titleElement).addClass("ui-chatbox-msg-title");
                        $(titleElement).html(title);
                        e.appendChild(titleElement);
                    } else {
                        systemMessage = true;
                    }
                    // Timestamp.
                    var timestampElement = document.createElement(
                        systemMessage ? "i" : "span");
                    $(timestampElement).addClass("ui-chatbox-msg-timestamp")
                    $(timestampElement).css('float', 'right');
                    $(timestampElement).css('color', '#aaa');
                    $(timestampElement).text(timestamp);
                    e.appendChild(timestampElement);
                    // Message.
                    var msgElement = document.createElement(
                        systemMessage ? "i" : "p");
                    $(msgElement).addClass("ui-chatbox-msg-content");
                    $(msgElement).html(msg);
                    e.appendChild(msgElement);
                    // Add chat box msg div.
                    $(e).addClass("ui-chatbox-msg");
                    $(e).attr("data-notification-id", id);
                    $(e).css("maxWidth", $(box).width());
                    $(e).fadeIn();
                    // Scroll to top.
                    self._scrollToTop();
                    // If not read then highlight and bounce.
                    if (read === 0 && !self.highlightLock) {
                        self.highlightLock = true;
                        self.highlightBox(read, boxTitle);
                    }
                    // If box is open then mark incoming notifications as read.
                    if (self.elem.uiChatboxContent.is(":visible")) {
                        self.elem.options.loader.markNotificationAsRead();
                    }
                },
                editMessage: function (title, id, msg, timestamp) {
                    var self = this;
                    var titleElement = $('div[data-notification-id=' + id +']').find('.ui-chatbox-msg-title');
                    $(titleElement).html(title);
                    var msgElement = $('div[data-notification-id=' + id +']').find('.ui-chatbox-msg-content');
                    $(msgElement).html(msg);
                    var timestampElement = $('div[data-notification-id=' + id +']').find('.ui-chatbox-msg-timestamp');
                    $(timestampElement).text(timestamp);
                },
                highlightBox: function (read, boxTitle) {
                    var self = this;
                    if (read === 0) {
                        self.elem.uiChatboxTitlebar.effect("highlight", {color:"#0036af"}, 1000, function() {
                            self.elem.uiChatboxTitlebar.find('span').html(boxTitle);
                            self.elem.uiChatboxTitlebar.css('background-color', '#0036af');
                            self.elem.uiChatboxTitlebar.css('border-color', '#0036af');
                            self.elem.uiChatboxTitlebar.css('color', '#ffffff');
                            if (self.elem.uiChatboxContent.is(":visible")) {
                                self.elem.uiChatboxTitlebarMinimize.find('img').attr('src', 'arrow-down-white.svg');
                            } else {
                                self.elem.uiChatboxTitlebarMinimize.find('img').attr('src', 'arrow-up-white.svg');
                            }
                        });
                        self.elem.uiChatbox.effect("bounce", {times: 3}, 1000, function() {
                            self.highlightLock = false;
                            // Scroll to top placement can be adjusted.
                            self._scrollToTop();
                        });
                    }
                },
                toggleBox: function () {
                    this.elem.uiChatbox.toggle();
                },
                _scrollToBottom: function () {
                    var box = this.elem.uiChatboxLog;
                    box.scrollTop(box.get(0).scrollHeight);
                },
                _scrollToTop: function () {
                    var box = this.elem.uiChatboxLog;
                    box.scrollTop(0);
                }
            }
        },
        toggleContent: function (event) {
            this.uiChatboxContent.toggle();
            this.uiChatboxTitlebar.find('span').html(this.options.title);
            this.uiChatboxTitlebar.css('background-color', '#ffffff');
            this.uiChatboxTitlebar.css('border-color', '#969696');
            this.uiChatboxTitlebar.css('color', '#5a5a5a');
            if (this.uiChatboxContent.is(":visible")) {
                // Mark msg as read.
                this.options.loader.markNotificationAsRead();
                this.uiChatboxTitlebarMinimize.find('img').attr('src', 'arrow-down-grey.svg');
            } else {
                this.uiChatboxTitlebarMinimize.find('img').attr('src', 'arrow-up-grey.svg');
            }
        },
        widget: function () {
            return this.uiChatbox
        },
        _create: function () {
            var self = this,
                options = self.options,
                title = options.title || "No Title",
                // ChatBox.
                uiChatbox = (self.uiChatbox = $('<div></div>'))
                    .appendTo(document.body)
                    .addClass('ui-widget' + 'ui-corner-top ' + 'ui-chatbox')
                    .attr('outline', 0)
                    .focusin(function () {
                        self.uiChatboxTitlebar.addClass('ui-state-focus');
                    })
                    .focusout(function () {
                        self.uiChatboxTitlebar.removeClass('ui-state-focus');
                    }),
                // TitleBar.
                uiChatboxTitlebar = (self.uiChatboxTitlebar = $('<div></div>'))
                    .addClass('ui-widget-header ' +
                        'ui-corner-top ' +
                        'ui-chatbox-titlebar ' +
                        'ui-dialog-header' // take advantage of dialog header style
                    )
                    .click(function (event) {
                        self.toggleContent(event);
                    })
                    .appendTo(uiChatbox),
                uiChatboxTitle = (self.uiChatboxTitle = $('<span></span>'))
                    .html(title)
                    .addClass("ui-chatbox-title")
                    .appendTo(uiChatboxTitlebar),
                uiChatboxTitlebarMinimize = (self.uiChatboxTitlebarMinimize = $('<a href="#"></a>'))
                    .addClass('ui-corner-all ' +
                        'ui-chatbox-icon'
                    )
                    .attr('role', 'button')
                    .hover(function() { uiChatboxTitlebarMinimize.addClass('ui-state-hover'); },
                        function() { uiChatboxTitlebarMinimize.removeClass('ui-state-hover'); })
                    .click(function(event) {
                        self.toggleContent(event);
                        self.options.boxMinimized(self.options.id);
                        return false;
                    })
                    .appendTo(uiChatboxTitlebar),
                uiChatboxTitlebarMinimizeImage = $('<img src="arrow-down-grey.svg"</img>')
                    .addClass('icon-arrow ' +
                        'minimize'
                    )
                    .appendTo(uiChatboxTitlebarMinimize),
                // Content.
                uiChatboxContent = (self.uiChatboxContent = $('<div></div>'))
                    .addClass('ui-widget-content ' +
                        'ui-chatbox-content '
                    )
                    .appendTo(uiChatbox),
                uiChatboxLog = (self.uiChatboxLog = self.element)
                    .addClass('ui-widget-content ' +
                        'ui-chatbox-log'
                    )
                    .appendTo(uiChatboxContent);
            // Disable selection.
            uiChatboxTitlebar.find('*').add(uiChatboxTitlebar).disableSelection();
            // Switch focus to input box when whatever clicked.
            uiChatboxContent.children().click(function() {
                // Click on any children, set focus on input box
                // self.uiChatboxInputBox.focus();
            });
            self._setWidth(self.options.width);
            self._position(self.options.offset);
            // Close initially.
            self.toggleContent();
            self.options.boxManager.init(self);
            if (!self.options.hidden) {
                uiChatbox.show();
            }
        },
        _setOption: function(option, value) {
            if (value != null) {
                switch (option) {
                    case "hidden":
                        if (value)
                            this.uiChatbox.hide();
                        else
                            this.uiChatbox.show();
                        break;
                    case "offset":
                        this._position(value);
                        break;
                    case "width":
                        this._setWidth(value);
                        break;
                }
            }
            $.Widget.prototype._setOption.apply(this, arguments);
        },
        _setWidth: function(width) {
            this.uiChatboxTitlebar.width(width + "px");
            this.uiChatboxLog.width(width + "px");
        },
        _position: function(offset) {
            this.uiChatbox.css("left", offset);
        }
    });
    }
);
