from django.db import models

class RoomSize(models.Model):
    bhk_type=models.IntegerField()
    size=models.IntegerField()
    units=models.IntegerField()

    class Meta:
        db_table = "room_size"

    def __str__(self):
        return self.size