# Generated by Django 4.1.7 on 2023-03-05 17:05

import bugalinkapp.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Driver',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dni', models.CharField(max_length=9)),
                ('drivingLicense', models.FileField(upload_to=bugalinkapp.models.Driver.user_directory_path)),
                ('vtcLicense', models.FileField(upload_to=bugalinkapp.models.Driver.user_directory_path)),
                ('swornDeclaration', models.FileField(upload_to=bugalinkapp.models.Driver.user_directory_path)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('idUser', models.AutoField(primary_key=True, serialize=False)),
                ('nickname', models.CharField(max_length=100)),
                ('bio', models.CharField(max_length=500)),
                ('name', models.CharField(max_length=100)),
                ('surname', models.CharField(max_length=100)),
                ('birthDate', models.DateField()),
                ('dni', models.CharField(max_length=9)),
                ('email', models.EmailField(max_length=254)),
                ('photo', models.ImageField(upload_to='uploads/')),
                ('balance', models.IntegerField()),
                ('residence', models.CharField(max_length=100)),
                ('city', models.CharField(max_length=100)),
                ('province', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Vehicule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('drivingLicense', models.CharField(max_length=7)),
                ('model', models.CharField(max_length=100)),
                ('insurance', models.FileField(upload_to=bugalinkapp.models.Vehicule.user_directory_path)),
                ('dniDriver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bugalinkapp.driver')),
            ],
        ),
        migrations.CreateModel(
            name='Routine',
            fields=[
                ('idRoutine', models.AutoField(primary_key=True, serialize=False)),
                ('startDate', models.DateField()),
                ('endDate', models.DateField()),
                ('startLocation', models.CharField(max_length=100)),
                ('endLocation', models.CharField(max_length=100)),
                ('frecuency', models.CharField(max_length=100)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bugalinkapp.user')),
            ],
        ),
        migrations.CreateModel(
            name='Lift',
            fields=[
                ('idLift', models.AutoField(primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('P', 'Pending start'), ('O', 'Ongoing'), ('F', 'Final')], default='P', max_length=30, null=True)),
                ('spaceLimit', models.IntegerField()),
                ('startDate', models.DateField()),
                ('endDate', models.DateField()),
                ('startLocation', models.CharField(max_length=100)),
                ('endLocation', models.CharField(max_length=100)),
                ('dniDriver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bugalinkapp.driver')),
                ('registrationNumber', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bugalinkapp.vehicule')),
            ],
        ),
        migrations.CreateModel(
            name='IndividualLift',
            fields=[
                ('idIndividualLift', models.AutoField(primary_key=True, serialize=False)),
                ('price', models.IntegerField()),
                ('status', models.CharField(choices=[('P', 'Pending start'), ('O', 'Ongoing'), ('F', 'Final')], default='P', max_length=30, null=True)),
                ('startDate', models.DateField()),
                ('endDate', models.DateField()),
                ('startLocation', models.CharField(max_length=100)),
                ('endLocation', models.CharField(max_length=100)),
                ('idLift', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bugalinkapp.lift')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bugalinkapp.user')),
            ],
        ),
    ]
