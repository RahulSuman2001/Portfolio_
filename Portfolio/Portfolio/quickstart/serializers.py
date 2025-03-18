from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import Users
from .models import UploadedFile



class Userse(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id','username','password','gender','privilege']


class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ['file', 'uploaded_at']
