export function thousandPointsFormatter(text: string): string {
  const value = parseInt(text)
  if (value === null || value === undefined || isNaN(value)) {
    return ''
  }

  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}


    export function formatDateToFrontend(dateString: string | undefined): string {
        if (!dateString) {
            return getCurrentDateFormatted();
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }

        if (dateString.includes("/")) {
            const [day, month, year] = dateString.split("/");
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }

        return getCurrentDateFormatted();
    }

    export function getCurrentDateFormatted(): string {
        const now = new Date();
        // Ajusta para o fuso horário local
        const offset = now.getTimezoneOffset();
        const localDate = new Date(now.getTime() - offset * 60 * 1000);
        return localDate.toISOString().split("T")[0];
    }
