# Generated migration for RoomSize model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('goldenray', '0038_sendquotejunk'),
    ]

    operations = [
        migrations.CreateModel(
            name='RoomSize',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bhk_type', models.IntegerField()),
                ('size', models.IntegerField()),
                ('units', models.IntegerField()),
            ],
            options={
                'db_table': 'room_size',
            },
        ),
    ]