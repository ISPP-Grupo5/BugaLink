import datetime

DAYS_OF_WEEK = (
    ("Mon", "Mon"),
    ("Tue", "Tue"),
    ("Wed", "Wed"),
    ("Thu", "Thu"),
    ("Fri", "Fri"),
    ("Sat", "Sat"),
    ("Sun", "Sun"),
)


def next_weekday(today, desired_weekday, desired_time):
    day = get_int_day_of_week(desired_weekday)
    days_ahead = day - today.weekday()
    if days_ahead < 0:  # Target day already happened this week
        days_ahead += 7
    elif days_ahead == 0:
        # If it's the desired weekday, check the desired_time
        now = today.time()
        if desired_time <= now:
            days_ahead += 7
    return today + datetime.timedelta(days_ahead)



def get_int_day_of_week(day): # Returns the number asociated with the Strinng of the Day, possible values: "Mon", "Tue", "Wed", etc
    enum_tuple = (day,day)
    number = DAYS_OF_WEEK.index(enum_tuple)
    return int(number)