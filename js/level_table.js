function renderLevelTable(data, container) {
  container.innerHTML = '';
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.background = '#fff';
  table.style.borderRadius = '12px';
  table.style.overflow = 'hidden';
  table.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr style="background:#f4f6fa;">
      <th style="padding:10px 16px;text-align:left;">Level</th>
      <th style="padding:10px 16px;text-align:left;">Most Frequent Requirement</th>
      <th style="padding:10px 16px;text-align:left;">Median Experience Years</th>
      <th style="padding:10px 16px;text-align:left;">Median # Requirements</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="padding:8px 16px;border-bottom:1px solid #eee;">${row.level}</td>
      <td style="padding:8px 16px;border-bottom:1px solid #eee;">${row.most_frequent_requirement.length > 75 ? row.most_frequent_requirement.slice(0,75) + "..." : row.most_frequent_requirement}</td>
      <td style="padding:8px 16px;border-bottom:1px solid #eee;">${row.median_experience_years}</td>
      <td style="padding:8px 16px;border-bottom:1px solid #eee;">${row.median_n_requirements}</td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  container.appendChild(table);
}