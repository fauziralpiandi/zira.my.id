import Submission from 'app/components/forms/Submission'

export const metadata = {
  title: 'Contact',
  description:
    'Need help? Share your thoughts, suggestions, anything\u2014 Get in touch!',
}

export default function ContactPage() {
  return (
    <section>
      <div className="animate-in">
        <Submission />
      </div>
    </section>
  )
}
