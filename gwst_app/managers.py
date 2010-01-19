from django.contrib.gis.db import models
class InterviewGroupMembershipManager(models.Manager):
    def get_current_group(self, user, interview):
        int_groups = self.filter(user=user, int_group__interview=interview).order_by('-percent_involvement','id')
        current_group_found = False
        for group in int_groups:
            if group.status != 'finalized' and group.status != 'skipped' and current_group_found == False:
                current_group_found = True
                return group
        return None
    
class InterviewShapeManager(models.GeoManager):
    pass