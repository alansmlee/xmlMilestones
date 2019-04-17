/**
 * *********************
 * date helper functions
 *
 * Requires: date-en-AU.js
 * *********************
 */
function todayDate() {
  return Date.today();
}

function init_datepicker() {
  $('.datepicker').datepicker({
    autoclose: true,
    format: 'dd/mm/yyyy'
  });
}

/**
 * @param {iteratable object} list e.g. Set | Array
 * @returns {Array} a sorted Array
 */
function sort(list) {
  var arr = [];
  list.forEach(function(value) {
    arr.push(value);
  });
  return arr.sort();
}

/**
 * Date Time Helper
 */
function diff_InDays(firstDate, secondDate) {
  if (Date.parse(firstDate) == null || Date.parse(secondDate) == null) {
    return null;
  }
  return Math.round((secondDate-firstDate)/86400000); // 1000*60*60*24;
}

/**
 * Usage: var dayeLeftStr = calcDuration(Date.parse('01/01/2019'), todayDate());
 */
function calcDuration(date_A, refDate) {
  var ymd = calcAge(date_A, refDate);
  var str = calcAgeResult2Str(ymd);
  if (ymd.compareResult == 1) {
    return '-' + str;
  } else {
    return str;
  }
}

/**
 * Usage:
 * var aStr = calcAgeResult2Str(
 * {
 *   years: 0,
 *   months: 1,
 *   days: 0,
 *   compareResult: -1
 * });
 */
function calcAgeResult2Str(ymd) {
  var str = '';
  if (ymd.years > 0) {
    str += ymd.years+'(y)';
  }
  if (ymd.months > 0) {
    str += ymd.months+'(m)';
  }
  if (ymd.days > 0 || str == '') {
    str += ymd.days+'(d)';
  }
  return str;
}

function is_DateA_after_DateB(date_A, date_B) {
  return date_B.compareTo(date_A) == -1
}

function is_DateA_before_DateB(date_A, date_B) {
  return date_B.compareTo(date_A) == 1
}

function is_DateA_equal_DateB(date_A, date_B) {
  return date_B.compareTo(date_A) == 0;
}

/**
 * Dates difference to 'x years, y months, z days'
 *
 * Usage: var bb = calcAge(Date.parse('05/05/2019'), todayDate());
 *
 * @param{Date} date_A
 * @param{Date} date_B
 * @returns{Object} 
 *   {
 *       years,   // number
 *       months,  // number
 *       days,    // number
 *       compareResult -->  1: date_A < date_B, 0: date_A == date_B, -1: date_A > date_B
 *    }
 */
function calcAge(date_A, date_B)
{
  if (date_A == null || date_B == null) {
    return null;
  }
  // For calc to work, date_1 must <= date_2
  var date_1;
  var date_2;
  var cmpFlag = date_B.compareTo(date_A);
  if (cmpFlag <= 0) {
    date_1 = date_B;
    date_2 = date_A;
  } else {
    date_1 = date_A;
    date_2 = date_B;
  }
  
  //convert to UTC
  var date2_UTC = new Date(Date.UTC(date_2.getUTCFullYear(), date_2.getUTCMonth(), date_2.getUTCDate()));
  var date1_UTC = new Date(Date.UTC(date_1.getUTCFullYear(), date_1.getUTCMonth(), date_1.getUTCDate()));
  var yAppendix, mAppendix, dAppendix;
  //--------------------------------------------------------------
  var days = date2_UTC.getDate() - date1_UTC.getDate();
  if (days < 0)
  {
      date2_UTC.setMonth(date2_UTC.getMonth() - 1);
      days += DaysInMonth(date2_UTC);
      days = Math.floor(days);  // Alan added to get whole number (05/05/2019 was showing 21.0416666666666)
  }
  //--------------------------------------------------------------
  var months = date2_UTC.getMonth() - date1_UTC.getMonth();
  if (months < 0)
  {
      date2_UTC.setFullYear(date2_UTC.getFullYear() - 1);
      months += 12;
  }
  //--------------------------------------------------------------
  var years = date2_UTC.getFullYear() - date1_UTC.getFullYear();
  if (years > 1) yAppendix = " years";
  else yAppendix = " year";
  if (months > 1) mAppendix = " months";
  else mAppendix = " month";
  if (days > 1) dAppendix = " days";
  else dAppendix = " day";

  return {
    years: years,
    months: months,
    days: days,
    compareResult: cmpFlag  // 1: date_A < date_B, 0: date_A == date_B, -1: date_A > date_B
  };
}

function DaysInMonth(date2_UTC)
{
  var monthStart = new Date(date2_UTC.getFullYear(), date2_UTC.getMonth(), 1);
  var monthEnd = new Date(date2_UTC.getFullYear(), date2_UTC.getMonth() + 1, 1);
  var monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24);
  return monthLength;
}
