# [Liftpad](https://liftpad.onrender.com)

[Link to live website](https://liftpad.onrender.com)

This is the back end repo. To view the front end repo, click the following link: 
[Link to frontend repository](https://github.com/HenryWinters/fitness-tracker)

## Table of contents
* [About the App](#about-the-app)
* [Screenshots](#screenshots)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [What would I change?](#what-would-i-change?)

## About the App 

Liftpad is a social media fitness application for weightlifters. It allows users to log their workout routines, track their progress, and share it with others. 

The app has an intuitive mobile-first design, designed to give users the ability to log their exercises, sets, reps, and weight as they progress through their workout. 

It's equipped with a homepage feed to view network's workouts, an individual workout feed, profile page, stats summary, exerice logger, and more.

## Screenshots
<p float='left'>
    <img alt='Screenshot of Liftpad log in page' src='src/images/liftpad.onrender.com_(iPhone 6_7_8 Plus).png' width=25% />
    <img alt='Screenshot of home feed on Iphone' src='src/images/liftpad.onrender.com_home(iPhone%206_7_8%20Plus).png' width=25%) />
    <img alt='Screenshot of user profile page' src='src/images/liftpad.onrender.com_profile_hlwinters(iPhone 6_7_8 Plus).png' width=25% />
</p>

## Technologies Used

Built with React, Node.js, Express, and MongoDB 

* React Router for routing 
* Axois for REST API requests 
* Encrypted password storage using bcrypt
* Password strength requirements with regex
* Token-based user authentication 
* Local storage for user information and workout progress - this was an important update so that users could close their phone, leave the app, close their phone,etc. during their workout without losing their tracking progress
* Inifite scroll to render workouts and users lists as user scrolls - with multiple lists that can grow quickly (users and workouts), I needed to add functionality that would limit the amount rendering to the page at once to improve app performance. I added infinite scroll to these lists to render workouts and users list as the user scrolls, instead of all at once. 

## Features 

* Register new profile  
* Log workouts down to the specific exercises, sets, reps, weight, and notes 
* Save workouts to feed
* View the workout feed of yourself and others
* View profiles that display user details, followers and following, and lifetime workout stats
* Follow and unfollow users 
* Like workouts ("fist bump")

## What would I change? 

If I did this project over again, I would have used Redux for state management. As my app and components grew, my state organization became complex and I had to pass props through many different components to acccess and update states. 