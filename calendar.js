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
            renderCalendar: async function() {
                const that = this;
                const rows = Math.ceil(that.getLastDate() / 7) + ((that.getLastDay() - that.getFirstDay()) >= 0 ? 0 : 1),
                    columns = that.weekNums ? 8 : 7;

                let curDate = 1, allowData = false;

                let table = '<div class=calendar__current-month><table><thead><tr>';

                if(that.weekNums)
                    table += '<th><span>№</span></th>';

                table += '<th><span>Вс</span></th>'
                        + '<th><span>Пн</span></th>'
                        + '<th><span>Вт</span></th>'
                        + '<th><span>Ср</span></th>'
                        + '<th><span>Чт</span></th>'
                        + '<th><span>Пт</span></th>'
                        + '<th><span>Сб</span></th>'
                        + '</tr></thead><tbody>';


                for(let i = 0; i < rows; ++i) {
                    table += '<tr>';
                    for(let j = 0; j < columns; ++j) {
                        table += '<td>';
                            if(that.weekNums && j === 0) {
                                table += '<span>';
                                table += new Date(`${that.date.getFullYear()}-${that.date.getMonth() + 1}-${curDate + 1}`).getWeek();
                                table += '</span>';
                            } else {
                                if(i === 0 && ((that.weekNums && j - 1 === that.getFirstDay()) || !that.weekNums && j === that.getFirstDay())) {
                                    allowData = true;
                                }
                                else if(i === rows - 1 && curDate === that.getLastDate() + 1) {
                                    break;
                                }

                                if(allowData) {
                                    table += curDate !== that.date.getDate()
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

                that.element.innerHTML = table + '</table></div>';

                if(neighbor) {
                    const curElem = that.element.getElementsByClassName('calendar__current-month')[0];
                    const prevElem = document.createElement("div");
                    prevElem.className = "calendar__prev-month";
                    const nextElem = document.createElement("div");
                    nextElem.className = "calendar__next-month";
                    that.element.insertBefore(prevElem, curElem);
                    that.element.appendChild(nextElem);

                    that.prevMonth = new Calendar(prevElem, that.weekNums, new Date(`${that.date.getFullYear()}-${that.date.getMonth()}-1`), false);
                    that.nextMonth = new Calendar(nextElem, that.weekNums, new Date(`${that.date.getFullYear()}-${that.date.getMonth() + 2}-1`), false);
                }
            }
        };

        calendar.renderCalendar();

        return calendar;
    };
    window.Calendar = Calendar;
})();