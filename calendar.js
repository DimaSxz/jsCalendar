!(function(){
    Date.prototype.getWeek = function() {
        const date = new Date(this.getTime());
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        const week = new Date(date.getFullYear(), 0, 4);
        return 1 + Math.round(((date.getTime() - week.getTime()) / 86400000 - 3 + (week.getDay() + 6) % 7) / 7);
    };

    const Calendar = function(element, weekNums = false, time = Date.now(), neighbor = true) {

        if(!(element instanceof HTMLElement))
            throw Error('Calendar element is not specified');

        const date = new Date(time);

        const calendar = {
            element,
            weekNums,
            date,
            prevMonth: null,
            nextMonth: null,
            getFirstDay: function() {
                return new Date(`${this.date.getFullYear()}-${this.date.getMonth() + 1}-1`).getDay();
            },
            getLastDay: function() {
                const date = new Date(`${this.date.getFullYear()}-${this.date.getMonth() + 1}-1`);

                date.setMonth(date.getMonth() + 1);
                date.setDate(0);

                return date.getDay();
            },
            getLastDate: function() {
                const date = new Date(`${this.date.getFullYear()}-${this.date.getMonth() + 1}-1`);

                date.setMonth(date.getMonth() + 1);
                date.setDate(0);

                return date.getDate();
            },
            renderCalendar: function () {
                const rows = Math.ceil(this.getLastDate() / 7) + ((this.getLastDay() - this.getFirstDay()) >= 0 ? 0 : 1),
                    columns = this.weekNums ? 8 : 7;

                let curDate = 1, allowData = false;

                let table = '<div class=calendar__current-month><table><thead><tr>';

                if(this.weekNums)
                    table += '<th><span>№</span></th>';

                table += '<th><span>Вс</span></th>';
                table += '<th><span>Пн</span></th>';
                table += '<th><span>Вт</span></th>';
                table += '<th><span>Ср</span></th>';
                table += '<th><span>Чт</span></th>';
                table += '<th><span>Пт</span></th>';
                table += '<th><span>Сб</span></th>';
                table += '</tr></thead><tbody>';


                for(let i = 0; i < rows; ++i) {
                    table += '<tr>';
                    for(let j = 0; j < columns; ++j) {
                        table += '<td>';
                            if(this.weekNums && j === 0) {
                                table += '<span>';
                                table += new Date(`${this.date.getFullYear()}-${this.date.getMonth() + 1}-${curDate + 1}`).getWeek();
                                table += '</span>';
                            } else {
                                if(i === 0 && ((this.weekNums && j - 1 === this.getFirstDay()) || !this.weekNums && j === this.getFirstDay())) {
                                    allowData = true;
                                }
                                else if(i === rows - 1 && curDate === this.getLastDate() + 1) {
                                    allowData = false;
                                }

                                if(allowData) {
                                    table += curDate !== this.date.getDate()
                                        ? `<span>${curDate}</span>`
                                        : `<span class=calendar__current-day>${curDate}</span>`;
                                    curDate++;
                                }
                            }
                        table += '</td>';
                    }
                    table += '</tr>';
                }

                table += '</tbody>';

                this.element.innerHTML = table + '</table></div>';

                if(neighbor) {
                    const curElem = this.element.getElementsByClassName('calendar__current-month')[0];
                    const prevElem = document.createElement("div");
                    prevElem.className = "calendar__prev-month";
                    const nextElem = document.createElement("div");
                    nextElem.className = "calendar__next-month";
                    this.element.insertBefore(prevElem, curElem);
                    this.element.appendChild(nextElem);

                    this.prevMonth = new Calendar(prevElem, this.weekNums, new Date(`${this.date.getFullYear()}-${this.date.getMonth()}-1`), false);
                    this.nextMonth = new Calendar(nextElem, this.weekNums, new Date(`${this.date.getFullYear()}-${this.date.getMonth() + 2}-1`), false);
                }
            }
        };

        calendar.renderCalendar();

        return calendar;
    };
    window.Calendar = Calendar;
})();