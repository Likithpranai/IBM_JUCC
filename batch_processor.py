import pandas as pd
import json
from university_matcher import UniversityMatcher
import os
from datetime import datetime

def process_all_students(output_dir="results"):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    matcher = UniversityMatcher(
        student_data_path='exchange_program_dataset_updated.csv',
        university_requirements_path='university_requirements.csv'
    )
    
    students_df = pd.read_csv('exchange_program_dataset_updated.csv')
    
    # Summary statistics
    summary = {
        'total_students': len(students_df),
        'universities': {},
        'average_rankings': {},
        'top_matches': [],
        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    # Process each student
    for i, student in students_df.iterrows():
        student_dict = student.to_dict()
        
        # Generate rankings
        rankings = matcher.generate_ranking(student_data=student_dict)
        
        # Save individual report
        student_filename = f"{output_dir}/{student['First Name']}_{student['Last Name']}_rankings.json"
        with open(student_filename, 'w') as f:
            json.dump({
                'student': {
                    'name': f"{student['First Name']} {student['Last Name']}",
                    'email': student['Email'],
                    'gpa': student['GPA'],
                    'ielts': student['IELTS']
                },
                'rankings': rankings
            }, f, indent=4)
        
        # Update summary statistics
        for rank_data in rankings:
            uni_name = rank_data['university']
            rank = rank_data['rank']
            
            # Initialize university data if not exists
            if uni_name not in summary['universities']:
                summary['universities'][uni_name] = {
                    'total_rankings': 0,
                    'sum_rankings': 0,
                    'students': []
                }
            
            # Update university statistics
            summary['universities'][uni_name]['total_rankings'] += 1
            summary['universities'][uni_name]['sum_rankings'] += rank
            summary['universities'][uni_name]['students'].append({
                'name': f"{student['First Name']} {student['Last Name']}",
                'rank': rank
            })
            
            # Add to top matches if rank is high
            if rank >= 8:
                summary['top_matches'].append({
                    'student': f"{student['First Name']} {student['Last Name']}",
                    'university': uni_name,
                    'rank': rank
                })
    
    # Calculate average rankings
    for uni_name, data in summary['universities'].items():
        if data['total_rankings'] > 0:
            avg_rank = data['sum_rankings'] / data['total_rankings']
            summary['average_rankings'][uni_name] = round(avg_rank, 1)
    
    # Sort top matches by rank
    summary['top_matches'] = sorted(summary['top_matches'], key=lambda x: x['rank'], reverse=True)
    
    # Save summary report
    summary_filename = f"{output_dir}/summary_report.json"
    with open(summary_filename, 'w') as f:
        json.dump(summary, f, indent=4)
    
    # Generate a more readable HTML report
    generate_html_report(summary, output_dir)
    
    print(f"Processed {len(students_df)} students. Results saved to {output_dir}/")
    print(f"Summary report: {summary_filename}")
    print(f"HTML report: {output_dir}/report.html")

def generate_html_report(summary, output_dir):
    """Generate an HTML report from the summary data"""
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>University Exchange Program Matching Report</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            h1, h2, h3 {{ color: #2c3e50; }}
            .container {{ max-width: 1200px; margin: 0 auto; }}
            table {{ border-collapse: collapse; width: 100%; margin-bottom: 20px; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; }}
            tr:nth-child(even) {{ background-color: #f9f9f9; }}
            .highlight {{ background-color: #e8f4f8; }}
            .section {{ margin-bottom: 30px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>University Exchange Program Matching Report</h1>
            <p>Generated on: {summary['timestamp']}</p>
            <p>Total students processed: {summary['total_students']}</p>
            
            <div class="section">
                <h2>Top Matches (Rank 8 or higher)</h2>
                <table>
                    <tr>
                        <th>Student</th>
                        <th>University</th>
                        <th>Rank</th>
                    </tr>
    """
    
    # Add top matches
    for match in summary['top_matches'][:20]:  # Limit to top 20
        html += f"""
                    <tr class="highlight">
                        <td>{match['student']}</td>
                        <td>{match['university']}</td>
                        <td>{match['rank']}/10</td>
                    </tr>
        """
    
    html += """
                </table>
            </div>
            
            <div class="section">
                <h2>University Average Rankings</h2>
                <table>
                    <tr>
                        <th>University</th>
                        <th>Average Rank</th>
                        <th>Number of Students</th>
                    </tr>
    """
    
    # Sort universities by average ranking
    sorted_unis = sorted(summary['average_rankings'].items(), key=lambda x: x[1], reverse=True)
    
    # Add university average rankings
    for uni_name, avg_rank in sorted_unis:
        num_students = summary['universities'][uni_name]['total_rankings']
        html += f"""
                    <tr>
                        <td>{uni_name}</td>
                        <td>{avg_rank}/10</td>
                        <td>{num_students}</td>
                    </tr>
        """
    
    html += """
                </table>
            </div>
            
            <div class="section">
                <h2>University Details</h2>
    """
    
    # Add university details
    for uni_name, data in summary['universities'].items():
        html += f"""
                <h3>{uni_name}</h3>
                <p>Average Rank: {summary['average_rankings'].get(uni_name, 'N/A')}/10</p>
                <p>Number of Students: {data['total_rankings']}</p>
                <table>
                    <tr>
                        <th>Student</th>
                        <th>Rank</th>
                    </tr>
        """
        
        # Sort students by rank
        sorted_students = sorted(data['students'], key=lambda x: x['rank'], reverse=True)
        
        for student in sorted_students:
            html += f"""
                    <tr>
                        <td>{student['name']}</td>
                        <td>{student['rank']}/10</td>
                    </tr>
            """
        
        html += """
                </table>
        """
    
    html += """
            </div>
        </div>
    </body>
    </html>
    """
    
    # Save HTML report
    with open(f"{output_dir}/report.html", 'w') as f:
        f.write(html)

if __name__ == "__main__":
    process_all_students()
