import { containsArabic, typography } from '../tokens'

/**
 * Text the USER wrote, rendered in the script it is actually in.
 *
 * A project title, a segment title, a note — the product cannot know at design
 * time whether any of these is Latin or Arabic, and it renders both. Given a
 * fixed Latin role, Arabic comes out in the UI face at line-height 1.3, which
 * crops its own ascenders and diacritics. Nothing overflows a container, so no
 * geometric check can see it; it simply looks broken.
 *
 * `dir="auto"` matters as much as the face: without it an RTL string truncates
 * from the wrong end, so the ellipsis eats the beginning of the title instead of
 * its tail.
 *
 * Use this anywhere user-authored text is displayed. Chrome the product wrote —
 * headings, labels, button text — is known at design time and takes its role
 * directly.
 */
export default function UserText({
  as: Tag = 'span',
  text,
  latinRole = typography.sectionTitle,
  arabicRole = typography.arabicCompact,
  style,
  children,
  ...rest
}) {
  const value = text ?? children
  const role = containsArabic(value) ? arabicRole : latinRole

  return (
    <Tag dir="auto" style={{ ...role, ...style }} {...rest}>
      {value}
    </Tag>
  )
}
