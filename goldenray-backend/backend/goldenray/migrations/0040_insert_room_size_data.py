# Generated migration to insert data into RoomSize model

from django.db import migrations


def insert_room_size_data(apps, schema_editor):
    RoomSize = apps.get_model('goldenray', 'RoomSize')
    
    # Sample room size data - you can modify these values as needed
    room_sizes = [
        {'bhk_type': 1, 'size': 800, 'units': 130},
        {'bhk_type': 2, 'size': 1200, 'units': 180},
        {'bhk_type': 2, 'size': 1400, 'units': 210},
        {'bhk_type': 3, 'size': 1800, 'units': 250},
        {'bhk_type': 3, 'size': 2200, 'units': 320},
        {'bhk_type': 4, 'size': 3000, 'units': 400},
        {'bhk_type': 4, 'size': 4000, 'units': 600},
    ]
    
    for room_data in room_sizes:
        RoomSize.objects.create(**room_data)


def reverse_insert_room_size_data(apps, schema_editor):
    RoomSize = apps.get_model('goldenray', 'RoomSize')
    RoomSize.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('goldenray', '0039_roomsize'),
    ]

    operations = [
        migrations.RunPython(
            insert_room_size_data,
            reverse_insert_room_size_data
        ),
    ]