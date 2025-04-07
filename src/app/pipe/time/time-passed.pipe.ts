import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timePassed',
  standalone: true,
  pure: false
})

export class TimePassedPipe implements PipeTransform {

  transform(createdAt: string, ...args: string[]): string {
    const postedDate = new Date(createdAt);
    const currentDate = new Date();

    const difference = currentDate.getTime() - postedDate.getTime();
    const millisecondsInMinute = 1000 * 60;
    const millisecondsInHour = millisecondsInMinute * 60;
    const millisecondsInDay = millisecondsInHour * 24;
    const millisecondsInWeek = millisecondsInDay * 7;
    const millisecondsInMonth = millisecondsInDay * 30;
    const millisecondsInYear = millisecondsInDay * 365;

    if (difference < millisecondsInMinute) {
      return 'Just now';
    } else if (difference < millisecondsInHour) {
      const minutes = Math.floor(difference / millisecondsInMinute);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (difference < millisecondsInDay) {
      const hours = Math.floor(difference / millisecondsInHour);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (difference < millisecondsInWeek) {
      const days = Math.floor(difference / millisecondsInDay);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (difference < millisecondsInMonth) {
      const weeks = Math.floor(difference / millisecondsInWeek);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (difference < millisecondsInYear) {
      const months = Math.floor(difference / millisecondsInMonth);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(difference / millisecondsInYear);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }
}