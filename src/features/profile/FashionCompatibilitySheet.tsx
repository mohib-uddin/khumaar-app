import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Close } from '@/components/icons';
import { Button, Card, IconButton, Pill, Text } from '@/components/ui';
import { SelectableCard } from '@/features/onboarding';
import {
  invokeStyleColors,
  saveGender,
  saveStylePalette,
} from '@/features/onboarding/api';
import { GENDER_OPTIONS } from '@/features/onboarding/constants';
import {
  isStylePalette,
  type GenderPresentation,
  type SkinUndertone,
  type StyleOccasion,
  type StylePalette,
  type StyleSwatch,
} from '@/lib/database.types';
import { layout, palette, radii, shadows, spacing } from '@/theme';

import { useCanUseColorStylist } from './canUseColorStylist';
import { undertoneLabel } from './colorPalettes';
import { getFitzpatrickMeta } from './fitzpatrick';

type Props = {
  visible: boolean;
  userId: string | null | undefined;
  gender: GenderPresentation | null | undefined;
  undertone: SkinUndertone | null | undefined;
  fitzpatrickType: number | null | undefined;
  savedPalette: StylePalette | null | undefined;
  onClose: () => void;
  onScan?: () => void;
  /** Called after save so parent can refreshProfile(). */
  onPaletteSaved?: () => void | Promise<void>;
};

const enter = (index: number) =>
  FadeInDown.delay(70 * index)
    .duration(380)
    .springify()
    .damping(16);

const SWATCH_CARD_WIDTH = Math.min(120, Dimensions.get('window').width * 0.32);
const SWATCH_GAP = spacing.base;

type LoadState = 'idle' | 'need_gender' | 'loading' | 'ready' | 'error';

/** On-demand AI color stylist sheet — occasion-based swipeable palettes. */
export function FashionCompatibilitySheet({
  visible,
  userId,
  gender,
  undertone,
  fitzpatrickType,
  savedPalette,
  onClose,
  onScan,
  onPaletteSaved,
}: Props) {
  const insets = useSafeAreaInsets();
  const fitz = getFitzpatrickMeta(fitzpatrickType);
  const canColorEdit = useCanUseColorStylist();

  const [paletteState, setPaletteState] = useState<StylePalette | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingGender, setSavingGender] = useState(false);
  const [pickedGender, setPickedGender] = useState<GenderPresentation | null>(null);
  const [isSavedLook, setIsSavedLook] = useState(false);
  const variationRef = useRef(0);
  const fetchGen = useRef(0);

  const fetchLook = useCallback(async (variation: number) => {
    const gen = ++fetchGen.current;
    setLoadState('loading');
    setErrorMessage(null);
    try {
      const next = await invokeStyleColors(variation);
      if (gen !== fetchGen.current) return;
      if (!isStylePalette(next)) {
        throw new Error('Stylist returned an invalid palette.');
      }
      setPaletteState(next);
      setIsSavedLook(false);
      setLoadState('ready');
    } catch (error) {
      if (gen !== fetchGen.current) return;
      setPaletteState(null);
      setLoadState('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not build your edit.',
      );
    }
  }, []);

  useEffect(() => {
    if (!visible) {
      fetchGen.current += 1;
      setLoadState('idle');
      setErrorMessage(null);
      setSaving(false);
      setSavingGender(false);
      setPickedGender(null);
      return;
    }

    if (!fitzpatrickType) {
      setPaletteState(null);
      setIsSavedLook(false);
      setLoadState('idle');
      return;
    }

    if (savedPalette && isStylePalette(savedPalette)) {
      setPaletteState(savedPalette);
      setIsSavedLook(true);
      setLoadState('ready');
      return;
    }

    if (!gender) {
      setPaletteState(null);
      setIsSavedLook(false);
      setLoadState('need_gender');
      return;
    }

    if (!canColorEdit) {
      setLoadState('error');
      setErrorMessage('Color Edit is available with Khumaar Pro.');
      return;
    }

    variationRef.current = Date.now() % 10000;
    void fetchLook(variationRef.current);
  }, [visible, fitzpatrickType, savedPalette, gender, canColorEdit, fetchLook]);

  const handleSaveGender = useCallback(async () => {
    if (!userId || !pickedGender || savingGender) return;
    setSavingGender(true);
    setErrorMessage(null);
    try {
      await saveGender(userId, pickedGender, { advanceStep: false });
      await onPaletteSaved?.();
      // Parent refresh updates `gender` prop → effect starts fetch.
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not save presentation.',
      );
    } finally {
      setSavingGender(false);
    }
  }, [userId, pickedGender, savingGender, onPaletteSaved]);

  const handleSave = useCallback(async () => {
    if (!userId || !paletteState || saving) return;
    if (!canColorEdit) return;
    setSaving(true);
    try {
      await saveStylePalette(userId, paletteState);
      setIsSavedLook(true);
      await onPaletteSaved?.();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not save this look.',
      );
    } finally {
      setSaving(false);
    }
  }, [userId, paletteState, saving, canColorEdit, onPaletteSaved]);

  const handleRegenerate = useCallback(() => {
    if (!canColorEdit) {
      setErrorMessage('Color Edit is available with Khumaar Pro.');
      return;
    }
    if (!gender) {
      setLoadState('need_gender');
      return;
    }
    variationRef.current = (variationRef.current + 37) % 10000;
    void fetchLook(variationRef.current);
  }, [fetchLook, gender, canColorEdit]);

  const toneForPill =
    paletteState?.undertone_read ?? undertone ?? null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close color sheet"
          style={styles.backdrop}
          onPress={onClose}
        />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.handle} />

          <View style={styles.topBar}>
            {toneForPill && fitz ? (
              <Pill paddingX={12} paddingY={6} background={palette.brand[50]}>
                <Text variant="metricSm" color={palette.brand[700]}>
                  {`${undertoneLabel(toneForPill)} · Type ${fitz.roman}`}
                </Text>
              </Pill>
            ) : (
              <View style={styles.topBarSpacer} />
            )}
            <IconButton size={46} accessibilityLabel="Close" onPress={onClose}>
              <Close size={18} color={palette.ink[700]} />
            </IconButton>
          </View>

          <View style={styles.heroCopy}>
            <Text variant="displaySm" color="textPrimary">
              {loadState === 'need_gender'
                ? 'How do you present?'
                : (paletteState?.look_name ?? 'Your color edit')}
            </Text>
            <Text variant="body" color="textTertiary" style={styles.subtitle}>
              {loadState === 'need_gender'
                ? 'Helps your color edit match your wardrobe.'
                : (paletteState?.blurb ??
                  'Stylist palette for your phototype · cosmetic only')}
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.scroll}>
            {!fitzpatrickType || !fitz ? (
              <Animated.View entering={enter(0)}>
                <Card style={styles.emptyCard}>
                  <Text variant="stepTitle" color="textPrimary">
                    Scan to unlock your edit
                  </Text>
                  <Text variant="caption" color="textTertiary" style={styles.subtitle}>
                    We need a phototype estimate from your face scan.
                  </Text>
                  {onScan ? (
                    <Button
                      label="Start scan"
                      variant="secondary"
                      onPress={() => {
                        onClose();
                        onScan();
                      }}
                      fullWidth
                    />
                  ) : null}
                </Card>
              </Animated.View>
            ) : loadState === 'need_gender' ? (
              <Animated.View entering={enter(0)} style={styles.genderBlock}>
                {GENDER_OPTIONS.map((option) => (
                  <SelectableCard
                    key={option.id}
                    label={option.label}
                    helper={option.helper}
                    selected={pickedGender === option.id}
                    onPress={() => setPickedGender(option.id)}
                  />
                ))}
                {errorMessage ? (
                  <Text variant="caption" color={palette.accent.warning}>
                    {errorMessage}
                  </Text>
                ) : null}
              </Animated.View>
            ) : loadState === 'loading' ? (
              <Animated.View entering={enter(0)} style={styles.loadingBlock}>
                <ActivityIndicator color={palette.brand[500]} />
                <Text variant="stepTitle" color="textPrimary">
                  Stylist is building your edit…
                </Text>
                <Text variant="caption" color={palette.ink[300]} style={styles.subtitle}>
                  A personal palette tuned to your phototype.
                </Text>
              </Animated.View>
            ) : loadState === 'error' ? (
              <Animated.View entering={enter(0)}>
                <Card style={styles.emptyCard}>
                  <Text variant="stepTitle" color="textPrimary">
                    Couldn’t build this edit
                  </Text>
                  <Text variant="caption" color="textTertiary" style={styles.subtitle}>
                    {errorMessage ?? 'Try again in a moment.'}
                  </Text>
                  <Button
                    label="Try again"
                    variant="secondary"
                    onPress={handleRegenerate}
                    fullWidth
                  />
                </Card>
              </Animated.View>
            ) : paletteState ? (
              <>
                <Animated.View entering={enter(0)} style={styles.section}>
                  <HeroSwatch swatch={paletteState.hero} />
                </Animated.View>

                {paletteState.occasions.map((occasion, index) => (
                  <Animated.View
                    key={occasion.id}
                    entering={enter(index + 1)}
                    style={styles.section}>
                    <Text variant="cardTitle" color="textPrimary">
                      {occasion.label}
                    </Text>
                    <OccasionSwipeRow occasion={occasion} />
                  </Animated.View>
                ))}

                <Text variant="caption" color={palette.ink[300]} style={styles.footnote}>
                  Cosmetic guidance for outfits by occasion — not a fashion rulebook.
                </Text>
              </>
            ) : null}
          </ScrollView>

          <View style={styles.footer}>
            {fitzpatrickType && loadState === 'need_gender' ? (
              <Button
                label={savingGender ? 'Saving…' : 'Continue'}
                onPress={
                  savingGender || !pickedGender || !userId
                    ? undefined
                    : () => {
                        void handleSaveGender();
                      }
                }
                fullWidth
              />
            ) : fitzpatrickType && loadState === 'ready' && paletteState ? (
              <>
                {isSavedLook ? (
                  <Text variant="caption" color={palette.ink[300]} style={styles.savedHint}>
                    Saved to your profile
                  </Text>
                ) : (
                  <Button
                    label={saving ? 'Saving…' : 'Save this look'}
                    onPress={
                      saving || !userId
                        ? undefined
                        : () => {
                            void handleSave();
                          }
                    }
                    fullWidth
                  />
                )}
                <Button
                  label="Try another look"
                  variant="secondary"
                  onPress={saving ? undefined : handleRegenerate}
                  fullWidth
                />
              </>
            ) : (
              <Button label="Done" variant="secondary" onPress={onClose} fullWidth />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function HeroSwatch({ swatch }: { swatch: StyleSwatch }) {
  return (
    <View style={styles.heroBlock}>
      <View style={[styles.heroColor, { backgroundColor: swatch.hex }]} />
      <View style={styles.heroMeta}>
        <Text variant="stepTitle" color="textPrimary">
          {swatch.label}
        </Text>
        <Text variant="captionMedium" color={palette.ink[300]}>
          {swatch.hex.toUpperCase()}
        </Text>
        <Text variant="caption" color={palette.ink[300]}>
          {swatch.why ?? 'Signature color'}
        </Text>
      </View>
    </View>
  );
}

function OccasionSwipeRow({ occasion }: { occasion: StyleOccasion }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={SWATCH_CARD_WIDTH + SWATCH_GAP}
      snapToAlignment="start"
      contentContainerStyle={styles.swipeContent}
      style={styles.swipeRow}>
      {occasion.colors.map((swatch) => (
        <View key={`${occasion.id}-${swatch.id}`} style={styles.swipeCard}>
          <View style={[styles.swipeSwatch, { backgroundColor: swatch.hex }]} />
          <Text variant="metricSm" color={palette.ink[500]} numberOfLines={1}>
            {swatch.label}
          </Text>
          <Text variant="caption" color={palette.ink[300]} numberOfLines={1}>
            {swatch.hex.toUpperCase()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(16, 16, 16, 0.35)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    maxHeight: '92%',
    backgroundColor: palette.white,
    borderTopLeftRadius: radii['3xl'],
    borderTopRightRadius: radii['3xl'],
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.base,
    gap: spacing.xl,
    ...shadows.floating,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.ink[100],
    marginBottom: spacing.sm,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarSpacer: {
    width: 46,
  },
  heroCopy: {
    gap: spacing.sm,
  },
  subtitle: {
    lineHeight: 20,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    gap: spacing['4xl'],
    paddingBottom: spacing.xl,
  },
  section: {
    gap: spacing.lg,
  },
  emptyCard: {
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  genderBlock: {
    gap: spacing.base,
  },
  loadingBlock: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing['4xl'],
    paddingHorizontal: spacing.xl,
  },
  heroBlock: {
    borderRadius: radii['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.ink[100],
    backgroundColor: palette.surface.sunken,
  },
  heroColor: {
    width: '100%',
    height: 140,
  },
  heroMeta: {
    padding: spacing.xl,
    gap: spacing.xxs,
  },
  swipeRow: {
    marginHorizontal: -layout.screenPaddingX,
  },
  swipeContent: {
    paddingHorizontal: layout.screenPaddingX,
    gap: SWATCH_GAP,
  },
  swipeCard: {
    width: SWATCH_CARD_WIDTH,
    gap: spacing.xxs,
  },
  swipeSwatch: {
    width: '100%',
    aspectRatio: 0.72,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: palette.ink[100],
  },
  footnote: {
    lineHeight: 16,
  },
  footer: {
    gap: spacing.base,
  },
  savedHint: {
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
