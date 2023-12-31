# Generated by Django 4.2.6 on 2023-11-02 16:00

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('articles', '0005_article_block'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='blocked_users',
            field=models.ManyToManyField(blank=True, null=True, related_name='blocked_articles', to=settings.AUTH_USER_MODEL),
        ),
    ]
