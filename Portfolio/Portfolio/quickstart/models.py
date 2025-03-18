from django.db import models
import json
class Users(models.Model):
    id=models.IntegerField
    username=models.CharField(max_length=150, unique=True)
    password=models.CharField(max_length=150)
    gender=models.CharField(max_length=150)
    privilege=models.CharField(max_length=150)
    

    class Meta:
        db_table = 'users'

class UploadedFile(models.Model):
    id=models.IntegerField
    file = models.FileField(upload_to='uploads/')  # Saves in media/uploads/
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table='filestable'

class FileResponse(models.Model):
    message = models.CharField(max_length=255, default="File uploaded successfully")
    file_name = models.CharField(max_length=255)
    file_data = models.JSONField() 

    class Meta:
        db_table = "file_responses"  # Explicit table name in MySQL

