'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CalendarIcon from '@/lib/icons/CalendarIcon';
import ChevronIcon from '@/lib/icons/ChevronIcon';
import NextIcon from '@/lib/icons/NextIcon';
import PreviousIcon from '@/lib/icons/PreviousIcon';
import DateHelpers from '@/lib/utils/DateHelpers';
import styles from './DatePicker.module.scss';

type DatePickerProps = {
    value: string;
    onChange: (value: string) => void;
};

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    type PopupRect = {
        top: number;
        left: number;
    };

    const POPUP_WIDTH = 280;
    const VIEWPORT_MARGIN = 8;
    const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const wrapperRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [popupRect, setPopupRect] = useState<PopupRect | null>(null);
    const [viewDate, setViewDate] = useState<Date>(
        DateHelpers.getDateObject(value.trim()) ?? new Date()
    );

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleTriggerClick = (): void => {
        if (!isOpen) setViewDate(selectedDate ?? new Date());
        setIsOpen((prev) => !prev);
    };

    const handlePrevMonth = (): void => {
        setViewDate(
            new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
        );
    };

    const handleNextMonth = (): void => {
        setViewDate(
            new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
        );
    };

    const handlePrevYear = (): void => {
        setViewDate(
            new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1)
        );
    };

    const handleNextYear = (): void => {
        setViewDate(
            new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1)
        );
    };

    const handleDayClick = (day: Date): void => {
        onChange(DateHelpers.getDateString(day));
        setIsOpen(false);
    };

    const handleClear = (): void => {
        onChange('');
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === 'Escape' && isOpen) {
            e.stopPropagation();
            setIsOpen(false);
        }
    };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const isSameDay = (a: Date, b: Date): boolean =>
        a.toDateString() === b.toDateString();

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const selectedDate = DateHelpers.getDateObject(value.trim());
    const today = new Date();
    const monthLabel = viewDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    const daysInMonth = new Date(
        viewDate.getFullYear(),
        viewDate.getMonth() + 1,
        0
    ).getDate();
    const leadingBlanks = new Date(
        viewDate.getFullYear(),
        viewDate.getMonth(),
        1
    ).getDay();
    const calendarDays: (Date | null)[] = [
        ...Array(leadingBlanks).fill(null),
        ...Array.from(
            { length: daysInMonth },
            (_, i) =>
                new Date(viewDate.getFullYear(), viewDate.getMonth(), i + 1)
        ),
    ];

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(target) &&
                !popupRef.current?.contains(target)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    useLayoutEffect(() => {
        if (!isOpen) return;
        const updateRect = (): void => {
            if (!wrapperRef.current) return;
            const rect = wrapperRef.current.getBoundingClientRect();
            setPopupRect({
                top: rect.bottom,
                left: Math.min(
                    rect.left,
                    window.innerWidth - POPUP_WIDTH - VIEWPORT_MARGIN
                ),
            });
        };
        updateRect();
        window.addEventListener('scroll', updateRect, true);
        window.addEventListener('resize', updateRect);
        return () => {
            window.removeEventListener('scroll', updateRect, true);
            window.removeEventListener('resize', updateRect);
        };
    }, [isOpen]);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div
            ref={wrapperRef}
            className={styles['date-picker']}
            onKeyDown={handleKeyDown}
        >
            <button
                type="button"
                className={styles.trigger}
                onClick={handleTriggerClick}
            >
                <CalendarIcon />
                <span className={styles['trigger-label']}>{value}</span>
            </button>
            {isOpen && popupRect
                ? createPortal(
                      <div
                          ref={popupRef}
                          className={styles.popup}
                          style={
                              {
                                  '--popup-top': `${popupRect.top}px`,
                                  '--popup-left': `${popupRect.left}px`,
                              } as React.CSSProperties
                          }
                      >
                          <div className={styles.header}>
                              <button
                                  type="button"
                                  className={styles.nav}
                                  onClick={handlePrevYear}
                                  aria-label="Previous year"
                              >
                                  <PreviousIcon />
                              </button>
                              <button
                                  type="button"
                                  className={`${styles.nav} ${styles['nav--prev']}`}
                                  onClick={handlePrevMonth}
                                  aria-label="Previous month"
                              >
                                  <ChevronIcon />
                              </button>
                              <span className={styles['month-label']}>
                                  {monthLabel}
                              </span>
                              <button
                                  type="button"
                                  className={`${styles.nav} ${styles['nav--next']}`}
                                  onClick={handleNextMonth}
                                  aria-label="Next month"
                              >
                                  <ChevronIcon />
                              </button>
                              <button
                                  type="button"
                                  className={styles.nav}
                                  onClick={handleNextYear}
                                  aria-label="Next year"
                              >
                                  <NextIcon />
                              </button>
                          </div>
                          <div className={styles.weekdays}>
                              {WEEKDAYS.map((weekday, i) => (
                                  <span key={i}>{weekday}</span>
                              ))}
                          </div>
                          <div className={styles.days}>
                              {calendarDays.map((day, i) =>
                                  day ? (
                                      <button
                                          key={day.toISOString()}
                                          type="button"
                                          className={`${styles.day}${isSameDay(day, today) ? ` ${styles['day--today']}` : ''}${selectedDate && isSameDay(day, selectedDate) ? ` ${styles['day--selected']}` : ''}`}
                                          onClick={() => handleDayClick(day)}
                                      >
                                          {day.getDate()}
                                      </button>
                                  ) : (
                                      <span key={`blank-${i}`} />
                                  )
                              )}
                          </div>
                          {value ? (
                              <button
                                  type="button"
                                  className={styles.clear}
                                  onClick={handleClear}
                              >
                                  Clear
                              </button>
                          ) : null}
                      </div>,
                      document.body
                  )
                : null}
        </div>
    );
};

export default DatePicker;
