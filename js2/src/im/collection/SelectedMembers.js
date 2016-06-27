/**
 * 已选人员
 */
define([
    "lib2/core/data/Collection",
    "src2/im/model/TeamMember"
], function(BaseCollection, Model) {
    var Collection = BaseCollection.extend({
        model: Model,
        initialize: function(models, option) {
            this.parent(models, option);
            Hby.Events.off(null, null, this);
            Hby.Events.on('im:collection:' + this.key + ':onAdd', this.onAdd, this);
            // 添加成员
            Hby.Events.on('im:collection:' + this.key + ':onRemove', this.onRemove, this);
        },
        onAdd: function(data) {
            data = _.isArray(data) ? data : [data];
            for(var i = 0; i < data.length; i++){
                var val = data[i];
                this.add(val);
            }
        },
        onRemove: function(data) {
            data = _.isArray(data) ? data : [data];
            for(var i = 0; i < data.length; i++){
                var val = data[i];
                this.remove(val);
            }
        },
    });
    return Collection;
});
