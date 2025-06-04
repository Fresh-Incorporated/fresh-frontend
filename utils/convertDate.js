export function formatDateRelative(input_date) {
    const date = new Date(input_date);

    const now = new Date();
    const targetDate = new Date(date);
    const seconds = Math.floor((now - targetDate) / 1000);

    if (seconds < 0) {
        return formatDateAbsolute(targetDate);
    }

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);

        if (interval >= 1) {
            if (unit === 'month' && interval >= 3) {
                return formatDateAbsolute(targetDate);
            }

            let unitForm;
            if (unit === 'second') {
                if (interval < 5) return 'пару секунд назад';
                if (interval < 20) return `${interval} секунд назад`;
            }
            if (unit === 'minute') unitForm = interval === 1 ? 'минуту' : interval < 5 ? 'минуты' : 'минут';
            else if (unit === 'hour') unitForm = interval === 1 ? 'час' : interval < 5 ? 'часа' : 'часов';
            else if (unit === 'day') unitForm = interval === 1 ? 'день' : interval < 5 ? 'дня' : 'дней';
            else unitForm = interval === 1 ? unit : unit === 'month' ? 'месяца' : 'лет';

            return `${interval} ${unitForm} назад`;
        }
    }

    return 'только что';
}

export function formatDateAbsolute(input_date) {
    const date = new Date(input_date);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}