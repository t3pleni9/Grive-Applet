const Applet = imports.ui.applet;
const Util = imports.misc.util;
const Settings = imports.ui.settings;
const GLib = imports.gi.GLib;
const PopupMenu = imports.ui.popupMenu;
const Lang = imports.lang;
const St = imports.gi.St;

function MyApplet(metadata,orientation, panel_height, instance_id) {
    this._init(metadata, orientation, panel_height, instance_id);
}

MyApplet.prototype = {
    __proto__: Applet.IconApplet.prototype,

    _init: function(metadata, orientation, panel_height, instance_id) {
        Applet.IconApplet.prototype._init.call(this, orientation, panel_height, instance_id);
        this.settings = new Settings.AppletSettings(this, "grive-sync@t3pleni9.com", instance_id);        
        this.path = metadata.path;
        this.settings.bindProperty(Settings.BindingDirection.IN, "select-drive-folder", "drive_folder", this.on_settings_changed, null);
        
        this._updateIconAndLabel();
        
        this._orientation = orientation;
        this._setup();
    },

    on_applet_clicked: function(event) {
        this.menu.toggle();
    },
    on_sync: function() {
        this.menu.close();
        command = "xterm -e 'grive -p " + this.drive_folder+"'";
        global.log(command);  
        Util.spawnCommandLine(command);
    },
    open_local: function() {
        this.menu.close();
        command = "xdg-open "+this.drive_folder;
        global.log(command);  
        Util.spawnCommandLine(command);
    },
    
    _setup: function() {
        this.menuManager = new PopupMenu.PopupMenuManager(this);
        this.menu = new Applet.AppletPopupMenu(this, this._orientation);
        this.menuManager.addMenu(this.menu);
        this._griveMenu = new St.BoxLayout({name: 'griveMenu'});
        this.menu.addActor(this._griveMenu);
        this._griveMenu.show_all();
        
        let item = new PopupMenu.PopupMenuItem(_("Sync"));
        item.connect("activate", Lang.bind(this, this.on_sync));
        item.actor.can_focus = true;
        global.reparentActor(item.actor, this._griveMenu);
        
        let item2 = new PopupMenu.PopupMenuItem(_("Open Local Drive"));
        item2.connect("activate", Lang.bind(this, this.open_local));
        item2.actor.can_focus = true;
        global.reparentActor(item2.actor, this._griveMenu);
    
    
    },
    
    on_settings_changed: function() {        
        
    },
    _launch_auth: function() {
        command = "xterm -e 'cd "+this.drive_folder+";pwd; grive -a'";
        global.log(command);  
        Util.spawnCommandLine(command);
    },
    _updateIconAndLabel: function(){
        
        this.menuIcon = this.path+"/sync.png";
        try {
                if (this.menuIcon == "") {
                    this.set_applet_icon_name("");
                } else if (GLib.path_is_absolute(this.menuIcon) && GLib.file_test(this.menuIcon, GLib.FileTest.EXISTS)) {
                    if (this.menuIcon.search("-symbolic") != -1)
                        this.set_applet_icon_symbolic_path(this.menuIcon);
                    else
                        this.set_applet_icon_path(this.menuIcon);
                } else if (Gtk.IconTheme.get_default().has_icon(this.menuIcon)) {
                    if (this.menuIcon.search("-symbolic") != -1)
                        this.set_applet_icon_symbolic_name(this.menuIcon);
                    else
                        this.set_applet_icon_name(this.menuIcon);
                }
        } catch(e) {
           global.logWarning("Could not load icon file \""+this.menuIcon+"\" for menu button");
        }
    }
};

function main(metadata, orientation, panel_height, instance_id) {
    return new MyApplet(metadata, orientation, panel_height, instance_id);
}
