from django.contrib.gis.db.models import *

class MapLayer(Model):
    LayerTypeChoices = (
        ( 'WMS','WMS' ),
        ( 'TMS','TMS' )
    )    
    name = CharField( max_length=50, unique=True )
    title = CharField( max_length=100 )
    type = CharField( max_length=30, choices = LayerTypeChoice )
    base_url = CharField( max_length=100, )
    min_zoom_level = IntegerField( default=0 )
    max_zoom_level = IntegerField( default=0)
    opacity = IntegerField( default=100 )
    legend_url = CharField( max_length=500 )
    is_base_layer = BooleanField( default=False )
    
    class Meta:
        db_table = u'gwst_mqp_layer'
        
    def __unicode__(self):
        return unicode(self.name)