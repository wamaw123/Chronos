
import React from 'react';
import { PrintableWeeklyReportProps } from '../types';

// This component is intended to be rendered to a static string.
// It includes basic HTML structure and tables for the report.
// Styles will be injected into the new window by App.tsx.

const PrintableReport: React.FC<PrintableWeeklyReportProps> = ({
  reportTitle,
  weekPeriod,
  generatedDate,
  totalWeekHoursFormatted,
  projectSummaries,
  abacusCodeSummaries,
}) => {
  return (
    <>
      <h1>{reportTitle}</h1>
      <p><strong>Period:</strong> {weekPeriod}</p>
      <p><strong>Generated on:</strong> {generatedDate}</p>
      
      <hr />

      <h2>Overall Summary</h2>
      <p><strong>Total Hours Logged:</strong> {totalWeekHoursFormatted}</p>

      {projectSummaries.length > 0 && (
        <>
          <hr />
          <h2>Project Breakdown</h2>
          <table>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Hours Logged</th>
              </tr>
            </thead>
            <tbody>
              {projectSummaries.map((p, index) => (
                <tr key={`project-${index}`}>
                  <td>
                    <span 
                      style={{ 
                        display: 'inline-block', 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: p.projectColor, 
                        marginRight: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '50%'
                      }}>
                    </span>
                    {p.projectName}
                  </td>
                  <td>{p.totalHoursFormatted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {abacusCodeSummaries.length > 0 && (
        <>
          <hr />
          <h2>Abacus Code Breakdown</h2>
          <table>
            <thead>
              <tr>
                <th>Abacus Code</th>
                <th>Hours Logged</th>
              </tr>
            </thead>
            <tbody>
              {abacusCodeSummaries.map((ac, index) => (
                <tr key={`abacus-${index}`}>
                  <td>{ac.abacusCode}</td>
                  <td>{ac.totalHoursFormatted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {!projectSummaries.length && !abacusCodeSummaries.length && totalWeekHoursFormatted === '0s' && (
        <p>No time logged for this week.</p>
      )}
    </>
  );
};

export default PrintableReport;