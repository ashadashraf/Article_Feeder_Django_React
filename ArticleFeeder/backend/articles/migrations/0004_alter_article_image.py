# Generated by Django 4.2.6 on 2023-11-02 11:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0003_remove_article_dislike_remove_article_like_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='image',
            field=models.ImageField(upload_to='=media/images'),
        ),
    ]
