import pyttsx3

# Initialize the text-to-speech engine
engine = pyttsx3.init()

# Text to be spoken
text_scene_1 = "Welcome to the E=Mc³ Ecosystem Media Centre. This comprehensive guide will walk you through the steps, tools, and best practices necessary to develop, deploy, and maintain this integrated platform for investment opportunities, financial services, and community engagement."
engine.setProperty('voice', 'english')  # Set the voice

# Saving the speech to a file
audio_path_scene_1 = "/mnt/data/Scene_1_Narration.wav"
engine.save_to_file(text_scene_1, audio_path_scene_1)
engine.runAndWait()  # Finalize the speech generation
