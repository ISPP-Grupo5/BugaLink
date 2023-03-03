from django.db import models
from django.conf import settings
from django.shortcuts import reverse

LIFTSTATUS = (
    ('P', 'Pending start'), ('O', 'Ongoing'),('F', 'Final')
)

class User(models.Model):
    idUser =  models.AutoField(primary_key=True)
    nickname = models.CharField(max_length=100)
    bio = models.CharField(max_length=500)
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    birthDate = models.DateField()
    dni = models.CharField(max_length=9)    # Restringir a 8 num y 1 letra
    email = models.EmailField(max_length = 254)
    photo = models.ImageField(upload_to ='uploads/')
    balance = models.IntegerField()
    residence = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100)

class Driver(models.Model):
    def user_directory_path(instance, filename):
        # file will be uploaded to MEDIA_ROOT / user_<id>/<filename>
        return 'user_{0}/{1}'.format(instance.user.id, filename)

    dni = models.CharField(max_length=9)  
    drivingLicense = models.FileField(upload_to = user_directory_path)
    vtcLicense = models.FileField(upload_to = user_directory_path)
    swornDeclaration =  models.FileField(upload_to = user_directory_path)

class Vehicule(models.Model):
    def user_directory_path(instance, filename):
        # file will be uploaded to MEDIA_ROOT / user_<id>/<filename>
        return 'user_{0}/{1}'.format(instance.user.id, filename)
    drivingLicense = models.CharField(max_length=7) 
    dniDriver =  models.ForeignKey(Driver, on_delete=models.CASCADE)
    model = models.CharField(max_length=100)
    insurance = models.FileField(upload_to = user_directory_path)

class Lift(models.Model):
    idLift = models.AutoField(primary_key=True)
    dniDriver =  models.ForeignKey(Driver, on_delete=models.CASCADE)
    status = models.CharField(default='P', choices=LIFTSTATUS, max_length=30, null=True) 
    spaceLimit = models.IntegerField()
    startDate = models.DateField()
    endDate = models.DateField()
    registrationNumber = models.ForeignKey(Vehicule, on_delete=models.CASCADE)
    startLocation = models.CharField(max_length=100)
    endLocation = models.CharField(max_length=100)

class IndividualLift(models.Model):
    idIndividualLift = models.AutoField(primary_key=True)
    idLift = models.ForeignKey(Lift, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.IntegerField()
    status = models.CharField(default='P', choices=LIFTSTATUS, max_length=30, null=True) 
    startDate = models.DateField()
    endDate = models.DateField()
    startLocation = models.CharField(max_length=100)
    endLocation = models.CharField(max_length=100)

class Routine(models.Model):
    idRoutine = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    startDate = models.DateField()
    endDate = models.DateField()
    startLocation = models.CharField(max_length=100)
    endLocation = models.CharField(max_length=100)
    frecuency = models.CharField(max_length=100)


    