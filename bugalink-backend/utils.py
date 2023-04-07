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


def next_weekday(d, weekday):
    day = get_int_day_of_week(weekday)
    days_ahead = day - d.weekday()
    if days_ahead <= 0:  # Target day already happened this week
        days_ahead += 7
    return d + datetime.timedelta(days_ahead)



def get_int_day_of_week(day): # Returns the number asociated with the Strinng of the Day, possible values: "Mon", "Tue", "Wed", etc
    enum_tuple = (day,day)
    number = DAYS_OF_WEEK.index(enum_tuple)
    return int(number)