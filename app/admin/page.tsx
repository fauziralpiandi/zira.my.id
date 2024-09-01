import Contact from './Contact'

export const metadata = {
  title: 'Admin',
  description:
    'We value your feedback! Please share your thoughts and suggestions.',
}

const PrivacyPolicy = () => {
  return (
    <section>
      <div className="animate-in">
        <Contact />
      </div>
    </section>
  )
}

export default PrivacyPolicy
