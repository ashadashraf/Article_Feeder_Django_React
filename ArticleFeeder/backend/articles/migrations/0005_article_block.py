# Generated by Django 4.2.6 on 2023-11-02 15:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0004_alter_article_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='block',
            field=models.BooleanField(default=False),
        ),
    ]