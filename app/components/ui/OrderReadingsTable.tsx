import React from 'react';
import styles from './ReadingsTable.module.css';

type Reading = {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  price?: number;
  premium?: boolean;
  conditional?: boolean;
  conditionLabel?: string;
};

type OrderReadingsTableProps = {
  readings: Reading[];
  selectable?: boolean;
  showPrice?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selected: string[]) => void;
  total?: number;
};

export function OrderReadingsTable({ readings, selectable = true, showPrice = true, selectedIds = [], onSelectionChange, total }: OrderReadingsTableProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  return (
    <>
      <div className={styles.tableContainer}>
        {/* Header row */}
        <div className={styles.headerRow}>
          <span style={{ flex: 2 }}>Reading</span>
          {selectable && <span className={styles.selectColumn}>Select</span>}
          {showPrice && (
            <span className={styles.priceColumn}>Price</span>
          )}
        </div>
        {/* List of readings */}
        <div>
          {readings.map((reading, idx) => {
            const isExpanded = expandedId === reading.id;
            const price = reading.price ?? 0; // Set to 0 for trial version
            return (
              <React.Fragment key={reading.id}>
                <div
                  className={`${styles.readingRow} ${idx % 2 === 0 ? styles.readingRowEven : styles.readingRowOdd} ${idx === readings.length - 1 ? '' : styles.readingRowBorder}`}
                  tabIndex={0}
                  onMouseEnter={(e) => {
                    e.currentTarget.classList.add(styles.readingRowHover);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.classList.remove(styles.readingRowHover);
                  }}
                  onClick={e => {
                    // Only expand if the click is not on the checkbox
                    if ((e.target as HTMLElement).tagName !== 'INPUT') {
                      setExpandedId(isExpanded ? null : reading.id);
                    }
                  }}
                  onKeyDown={e => {
                    // Only expand if the key event is not on the checkbox
                    if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.key === 'Enter' || e.key === ' ')) {
                      setExpandedId(isExpanded ? null : reading.id);
                    }
                  }}
                >
                  <span className={styles.readingName}>
                    {reading.name} ℹ️
                  </span>
                  {selectable && (
                    <span className={styles.selectColumn}>
                      <button
                        type="button"
                        className={`${styles.selectButton} ${selectedIds.includes(reading.id) ? styles.selectButtonSelected : ''}`}
                        onClick={e => {
                          e.stopPropagation();
                          onSelectionChange?.(selectedIds.includes(reading.id) ? selectedIds.filter(x => x !== reading.id) : [...selectedIds, reading.id]);
                        }}
                        onKeyDown={e => e.stopPropagation()}
                        tabIndex={-1}
                        aria-label={`Select ${reading.name}`}
                      >
                        {selectedIds.includes(reading.id) ? 'Selected' : 'Add'}
                      </button>
                    </span>
                  )}
                  {showPrice && (
                    <span className={styles.priceColumn}>
                      <div className={styles.priceText}>
                        <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>
                          ${price.toFixed(2)}
                        </span>
                      </div>
                    </span>
                  )}
                </div>
                {isExpanded && (
                  <div className={styles.descriptionRow}>
                    {reading.description}
                  </div>
                )}
              </React.Fragment>
            );
          })}
          {/* Total row */}
          {showPrice && (
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              {selectable && (
                <span className={styles.selectColumn}>
                  {/* Empty space to maintain alignment */}
                </span>
              )}
              <span className={styles.priceColumn}>
                <div className={styles.totalAmount}>
                  ${total ? total.toFixed(2) : '0.00'}
                </div>
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 