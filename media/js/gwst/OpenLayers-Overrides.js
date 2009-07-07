OpenLayers.Geometry.Point.prototype.distanceTo = function(point) {
    var distance = 0.0;
    
    // transform the point to an area-preserving projection
    var transformedThis = this.clone();
    var transformedPoint = point.clone();
    var sourceProj = gwst.config.projection; // EPSG:900913
    var destProj = gwst.config.equalAreaProjection; // EPSG:3310
    transformedThis.transform( sourceProj, destProj );
    transformedPoint.transform( sourceProj, destProj );
    
    if ( (transformedThis.x != null) && (transformedThis.y != null) && 
         (transformedPoint != null) && (transformedPoint.x != null) && (transformedPoint.y != null) ) {
         
         var dx2 = Math.pow(transformedThis.x - transformedPoint.x, 2);
         var dy2 = Math.pow(transformedThis.y - transformedPoint.y, 2);
         distance = Math.sqrt( dx2 + dy2 );
    }
    return distance;
};


OpenLayers.Geometry.LinearRing.prototype.getArea = function() {
    var area = 0.0;
    if ( this.components && (this.components.length > 2)) {
        var sourceProj = gwst.config.projection; // EPSG:900913
        var destProj = gwst.config.equalAreaProjection; // EPSG:3310
        var sum = 0.0;
        for (var i=0, len=this.components.length; i<len - 1; i++) {
            var b = this.components[i].clone();
            b.transform( sourceProj, destProj );
            var c = this.components[i+1].clone();
            c.transform( sourceProj, destProj );
            sum += (b.x + c.x) * (c.y - b.y);
        }
        area = - sum / 2.0;
    }
    return area;
};


OpenLayers.Control.Measure.prototype.displaySystemUnits = {
        geographic: ['dd'],
        english: ['mi', 'ft', 'in'],
        metric: ['km', 'm'],
        nautical: ['nmi']
};

OpenLayers.Control.MousePosition.prototype.formatCoords = function (base) {
    //var digits = parseInt(this.numDigits);
    var sign = '';
    if ( base < 0 )
        sign = '-';
        
    var abs_base = Math.abs(base);
    
    var t, t2;
    var minute_pad = '';
    var degrees = Math.floor(abs_base);
    t = ( abs_base - degrees ) * 60;
    var minutes = t;
    
    //var minutes = Math.floor(t);
    //var seconds = Math.floor(t2 = ( t - minutes ) * 6000);
    //seconds = seconds / 100.00;
    
    if ( minutes < 10 )
        minute_pad = '0';
    return (sign + degrees + "\u00B0 " + minute_pad + minutes.toFixed(3) + "\u0027 " ); //+ seconds + "\u0022" );
};


OpenLayers.Control.MousePosition.prototype.formatOutput = function(lonLat) {
    var newHtml = this.formatCoords(lonLat.lat) + this.separator + this.formatCoords(lonLat.lon);
    return newHtml;
};


OpenLayers.Control.Navigation.prototype.defaultDblClick = function (evt) {
    if (gwst.app.map.over)
    {
        gwst.editMpaAttributes(gwst.app.map.over.attributes.mpa);
    }
};
