const {createError, json} = require('micro')
const {sendMail} = require('../_utils')
const {AUTH_EMAIL} = process.env

module.exports = async (req, res) => {
	try {
		if (req.method !== 'POST') {
			throw createError(405, 'Method Not Allowed.')
		}

		const {to, from = AUTH_EMAIL, subject, text, html} = await json(req)

		if (!to) {
			throw createError(500, `Missing to address.`)
		}

		if (!subject) {
			throw createError(500, 'Missing subject.')
		}

		if (!text && !html) {
			throw createError(500, 'Missing text or html.')
		}

		const info = await sendMail({
			from,
			to,
			subject,
			text,
			html,
		})

		res.json({
			code: 200,
			status: 'success',
			message: info.response,
			data: info,
		})
	} catch (err) {
		res.json({
			code: err.statusCode,
			status: 'error',
			message: err.message,
		})
	}
}
