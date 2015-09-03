
if (jQuery.Game == undefined)
    jQuery.Game = {}

if (jQuery.Game.AssetType == undefined)
    jQuery.Game.AssetType = {}

jQuery.Game.AssetType.Image = 0;
jQuery.Game.AssetType.Spritesheet = 1;

jQuery.Game.LoadAsset = function (gameObj, name, type, path, position) {
    switch (type) {
        case $.Game.AssetType.Image:
            gameObj.load.image(name, path);
            break;
        case $.Game.AssetType.Spritesheet:
            gameObj.load.spritesheet(name, path, position.x, position.y);
            break;
        default:
            console.log(String.format("Was not able to load asset: Name='{0}', Type='{1}', Path='{2}'", name, type, path));
            break;
    }
};

if (!String.format) {
    String.format = function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
            ;
        });
    };
}

