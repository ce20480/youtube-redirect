import json
import os
import re

from flask import Flask, jsonify, request

# from flask_cors import CORS
from llama_cpp import Llama

app = Flask(__name__)
# CORS(app)

# Load your local model (example uses Hugging Face Transformers)
# MODEL_PATH = "/Users/avini/.lmstudio/models/mlx-community/Llama-3.2-3B-Instruct-4bit"  # Replace with your locally downloaded model
# llm = Llama(model_path=MODEL_PATH)

# llm = Llama.from_pretrained(
#     repo_id="bartowski/Llama-3.2-3B-Instruct-GGUF",
#     filename="Llama-3.2-3B-Instruct-IQ3_M.gguf",
# )

PATH_TO_MODEL = "./models/Llama 3.2 3B Instruct.gguf"
CONTEXT_SIZE = 1024

if os.path.exists(PATH_TO_MODEL):
    # load model from local models directory
    print("Model path found:", os.path.exists(PATH_TO_MODEL))
    print("Model path:", PATH_TO_MODEL)
    llm = Llama(
        model_path=PATH_TO_MODEL,
        # vocab_only=True,
        n_ctx=CONTEXT_SIZE,
        verbose=False,
        # n_gpu_layers=-1, # Uncomment to use GPU acceleration
        # seed=1337, # Uncomment to set a specific seed
        # n_ctx=2048, # Uncomment to increase the context window
    )


def generate_text_from_prompt(
    user_prompt,
    max_tokens=50,
    temperature=0.1,
    top_p=0.3,
    echo=True,
    # stop=["Q", "\n"],
):

    # Define the parameters
    model_output = llm(
        user_prompt,
        max_tokens=max_tokens,
        temperature=temperature,
        top_p=top_p,
        echo=echo,
        # stop=stop,
    )

    return model_output


@app.route("/evaluate", methods=["POST", "OPTIONS"])
def evaluate():
    """
    Evaluate the survey response and decide if watching the video is justified.
    """
    if request.method == "OPTIONS":
        # Preflight request
        return jsonify({}), 200

    data = request.json  # Receive JSON data from the extension
    if not data or not all(key in data for key in ("survey_response", "video_title")):
        return jsonify({"error": "Invalid input"}), 400

    survey_response = data["survey_response"]  # Extract the survey response
    video_title = data["video_title"]  # Extract the video_title
    # survey_response = (
    #     "I am a student and I am interested in learning more about the topic."
    # )
    # survey_response = "I don't care"
    # survey_response = "I really want to understand how the best badminton player of all time Lin Dan plays the game! I especially want to observe his footwork to bring any improvements especially with the split step into my game!"
    # prompt = f"Evaluate this survey response: '{survey_response}' and decide if watching the video is justified. If your confidence level that the answer is valid is above 0.7 then respond with true else false. IMPORTANT: Begin your answer with the approval status and be concise"
    # prompt = f"Evaluate this survey response: '{survey_response}' for the video titled '{video_title}'. Evaluate with a true or false if you believe that they would be increasing their productivity by watching the video. Do not assume anything "
    # prompt = (
    #     f"You are a highly intelligent assistant that evaluates survey responses to determine if a user’s justification for watching a video is valid. "
    #     f"Here is your task:\n\n"
    #     f"Survey Response: {survey_response}\n\n"
    #     f"Video Title: {video_title}\n\n"
    #     f"Instructions:\n"
    #     f"1. Analyze whether the survey response aligns with the video title.\n"
    #     f"2. Decide if the justification for watching the video is valid based on logical reasoning.\n"
    #     f"3. Return one of the following responses:\n"
    #     f'   - "True": The justification is valid.\n'
    #     f'   - "False": The justification is invalid.\n\n'
    #     f"Provide a concise explanation (in one or two sentences) for your decision."
    # )
    # prompt = f"""
    # You are an intelligent assistant that evaluates survey responses. Your task:
    #
    # Survey Response: {survey_response}
    # Video Title: {video_title}
    #
    # Instructions:
    # 1. Determine if the survey response justifies watching the video.
    # 2. Respond ONLY in this exact format:
    #    <True/False>
    #    <Justification>
    # 3. Do NOT provide any additional comments, edge-case reasoning, or default responses.
    #
    # Example:
    # True
    # The justification provided is sufficient to support the user's claim.
    #
    # Please evaluate the survey response.
    #
    # <True/False>
    # <Justification>
    # """
    prompt = f"""
You are an intelligent assistant that evaluates survey responses. Your task:

1. You will receive:
   - Survey Response: {survey_response}
   - Video Title: {video_title}

2. Determine whether the survey response demonstrates a sufficiently productive or useful reason for watching the video.

3. Return the decision in JSON format with exactly two keys:
   - "Verdict": must be either "True" or "False".
   - "Explanation": a short justification (1–2 sentences) explaining why the verdict is true or false.

4. Do NOT provide any additional keys, disclaimers, or text. Your response must be only the JSON object.

Example:

{{
  "Verdict": "True",
  "Explanation": "The user clearly shows a compelling reason to watch the video and benefits from its content."
}}

Please evaluate the survey response and return only the JSON as specified.
"""
    # max_tokens = 100
    # temperature = 0.3
    # top_p = 0.1
    # echo = True
    # stop = ["Q", "\n"]

    # Generate text from the LLaMA model
    # result = llm(prompt, max_tokens=50, temperature=0.7)

    # Use the create_chat_completion method for better performance
    # result = llm.create_chat_completion(messages=[{"role": "user", "content": prompt}])

    # From model local
    result = generate_text_from_prompt(prompt)

    # Extract the response text when using chat_completion
    # generated_text = result["choices"][0]["message"]["content"].strip()

    # Extract the response text when using the local llm method
    generated_text = result["choices"][0]["text"].strip()
    # generated_text = generated_text.replace(prompt, "")
    # return jsonify({"decision": generated_text})

    # Regex to extract the first True/False and justification sentence

    # match = re.search(r"(True|False)\s*(.*)", generated_text, re.DOTALL)
    # if match:
    #     decision, justification = match.groups()
    #     decision = decision.strip()
    #     justification = justification.strip()
    # else:
    #     decision = "False"
    #     justification = "The model did not provide a valid response."
    decision, justification = parse_llm_response(generated_text)

    # Removing prompt from generated
    # generated_text = generated_text.replace(prompt, "")
    #
    # # Determine approval based on the response
    # # decision = "approved" if "true" in generated_text.lower() else "denied"
    # decision = (
    #     "approved"
    #     if re.search(r"\bvalid\b", generated_text, re.IGNORECASE)
    #     else "denied"
    # )

    # if no flask app server is running use normal json
    # return json.dumps([{"decision": decision, "evaluation": generated_text}])

    # return jsonify({"decision": decision, "evaluation": generated_text})
    return jsonify({"decision": decision, "evaluation": justification})


@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    return response


def parse_llm_response(generated_text):
    """
    Parse the LLM response to extract the decision and justification.
    Handles cases where the response includes the prompt, examples, or extra text.
    """
    try:
        # Extract the last JSON block using regex
        json_matches = re.findall(r"{.*?}", generated_text, re.DOTALL)
        if not json_matches:
            raise ValueError("No valid JSON blocks found in the response.")

        # Use the last JSON block
        cleaned_text = json_matches[-1]

        # Attempt to parse the JSON
        parsed_response = json.loads(cleaned_text)
        decision = parsed_response.get("Verdict", "False").strip()
        justification = parsed_response.get(
            "Explanation", "The model did not provide a valid response."
        ).strip()
        return decision, justification

    except (json.JSONDecodeError, ValueError) as e:
        # Fallback to regex if JSON parsing fails
        print("Invalid JSON, falling back to regex parsing:", e)
        match = re.search(
            r"\"Verdict\":\s*\"(True|False)\".*?\"Explanation\":\s*\"(.*?)\"",
            generated_text,
            re.DOTALL,
        )
        if match:
            decision, justification = match.groups()
            return decision.strip(), justification.strip()
        else:
            # If neither JSON nor regex works, default to False
            return "False", "The model did not provide a valid response."


if __name__ == "__main__":
    app.run()
