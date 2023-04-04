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
    days_ahead = weekday - d.weekday()
    if days_ahead <= 0:  # Target day already happened this week
        days_ahead += 7
    return d + datetime.timedelta(days_ahead)
