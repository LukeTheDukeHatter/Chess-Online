from email.message import EmailMessage
import smtplib


class MailServer:
	def __init__(self, username: str, password: str):
		self.server = smtplib.SMTP("smtp.gmail.com", 587)
		self.server.starttls()
		self.server.login(username, password)

	def SendEmail(self, recipient: str, subject: str, body: str):
		msg = EmailMessage()
		msg.set_content(body)
		msg['subject'] = subject
		msg['to'] = recipient
		msg['from'] = 'LuukeChess Registration'

		self.server.send_message(msg)

	def Stop(self):
		self.server.quit()
