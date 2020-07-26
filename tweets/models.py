from django.db import models
import random
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Tweet(models.Model):
    # Maps to SQL data
    # id = models.AutoField(primary_key)
    user = models.ForeignKey(User, on_delete=models.CASCADE) # Many users can many tweets
    # user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL) # To conserve the history of tweets and don't delete all related tweets from the user
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to='images/', blank=True, null=True)

    class Meta:
        ordering = ['-id']
    
    def __str__(self):
        return self.content

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "likes": random.randint(0, 200)
        }