from flask import Blueprint, request, jsonify
from app.services.SkyvernService import SkyvernService
import logging

logging.basicConfig(level=logging.INFO)

main = Blueprint('main', __name__)

@main.route('/ask', methods=['POST'])
def ask_query():
    logging.info('Received a request to ask a query.')

    data = request.get_json()
    if not data or 'query' not in data:
        logging.warning('No query provided in the request.')
        return jsonify({'error': 'Query is required'}), 400

    query = data.get('query').strip()
    if not query:
        logging.warning('Invalid query provided in the request.')
        return jsonify({'error': 'Query must be a non-empty string'}), 400

    service = SkyvernService()

    try:
        logging.info(f'Sending query to Skyvern: {query}')
        task_info = service.query_perplexity(query)  
        
        if 'task_id' in task_info:
            return jsonify({'task_id': task_info['task_id']}), 200
        else:
            return jsonify({'error': 'Failed to create task in Skyvern'}), 500
    except Exception as e:
        logging.error(f'Error while processing query "{query}": {str(e)}', exc_info=True)
        return jsonify({'error': 'Failed to process query'}), 500


@main.route('/result/<task_id>', methods=['GET'])
def get_result(task_id):
    service = SkyvernService()
    try:
        task_status = service.poll_task_status(task_id)  

        print(task_status, 'task_status')

        if task_status['status'] == 'completed':
            return jsonify({
                'status': 'completed',
                'result': task_status.get('extracted_information')
            }), 200
        elif task_status['status'] in ['failed', 'terminated']:
            return jsonify({'error': f"Task {task_status['status']}."}), 500
        else:
            return jsonify({'status': task_status['status']}), 202  # Still processing
    except Exception as e:
        logging.error(f'Error while polling task "{task_id}": {str(e)}', exc_info=True)
        return jsonify({'error': 'Failed to poll task status'}), 500