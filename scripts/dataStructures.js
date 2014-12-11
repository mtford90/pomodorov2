function makeOrderedHash() {
    var keys = [];
    var vals = {};
    return {
        push: function(k,v) {
            if (!vals[k]) keys.push(k);
            vals[k] = v;
        },
        insert: function(pos,k,v) {
            if (!vals[k]) {
                keys.splice(pos,0,k);
                vals[k] = v;
            }
        },
        val: function(k) {return vals[k]},
        length: function(){return keys.length},
        keys: function(){return keys},
        values: function(){return vals}
    };
}

module.exports = {
    makeOrderedHash: makeOrderedHash
};