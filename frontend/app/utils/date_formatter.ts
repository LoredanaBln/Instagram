export class DateFormatter {
    static formatDate(isoString: string) {
        const date = new Date(isoString);
        const formatter = new Intl.DateTimeFormat("en", { day: "numeric", month: "short" });
        return formatter.format(date);
    }
}
