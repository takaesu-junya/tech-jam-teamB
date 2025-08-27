import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// 九州うまかもん酒場 琉神のHotPepper ID（実際のIDに置き換える必要があります）
const RYUJIN_SHOP_ID = "J001295659"; // 仮のID

const reviews = [
  {
    userName: "田中 健太",
    email: "tanaka.kenta@example.com",
    employeeNumber: "CA2019001",
    yearsOfService: 5,
    userType: "normal" as const,
    rating: 5,
    content: `同期会で初めて利用しました。沖縄にいながら本格的な九州料理が味わえるのが新鮮で、特に馬刺しの三種盛りは絶品！赤身、たてがみ、霜降りの違いがはっきり分かって、日本酒との相性も最高でした。個室だったので、周りを気にせず仕事の話からプライベートな話までできて良かったです。Webサイトのデザインが綺麗で、そのままスムーズに予約できたのも、僕らみたいなIT業界の人間からすると好印象。QRコードで注文できるシステムも、店員さんを呼ばずに済むので会話が途切れず、ストレスフリーでした。おもろまちで飲むときの定番になりそうです。`,
  },
  {
    userName: "山田 美咲",
    email: "yamada.misaki@example.com",
    employeeNumber: "CA2018002",
    yearsOfService: 6,
    userType: "normal" as const,
    rating: 5,
    content: `プロジェクトの打ち上げで、マネージャーが予約してくれました。店内は清潔感があって、照明の感じも落ち着いていてお洒落。料理の盛り付けがどれも綺麗で、特に目の前で炙ってくれる佐賀牛炙り寿司は、香ばしい香りとジューシーな旨味がたまらなくて、思わずみんなで動画を撮っちゃいました！掘りごたつ式の個室だったので、リラックスして楽しめたのも嬉しいポイント。沖縄料理のゴーヤチャンプルーも、出汁が効いてて美味しかったです。美味しいものをちょっとずつ沢山食べたい、という気分の時にぴったりのお店だと思います。`,
  },
  {
    userName: "佐藤 大輔",
    email: "sato.daisuke@example.com",
    employeeNumber: "CA2013003",
    yearsOfService: 11,
    userType: "meister" as const,
    rating: 5,
    content: `県外からのお客様との会食で利用させていただきました。おもろまち駅から近く、アクセスが良いのがまず有り難いですね。落ち着いた雰囲気の完全個室で、ビジネスの話もスムーズに進めることができました。沖縄料理でおもてなしするのも良いですが、あえて九州の本格的な味、ということで胡麻サバやからし蓮根を注文したところ、お客様に大変喜んでいただけました。焼酎の品揃えも豊富で、九州出身のお客様も納得のラインナップ。料理の質、店の雰囲気、スタッフの対応、どれをとっても満足のいくレベルで、安心してゲストをお連れできるお店です。`,
  },
  {
    userName: "鈴木 あかり",
    email: "suzuki.akari@example.com",
    employeeNumber: "CA2023004",
    yearsOfService: 1,
    userType: "normal" as const,
    rating: 5,
    content: `部署の歓迎会で先輩方に連れて行ってもらいました。社会人になって初めての飲み会でしたが、お店の雰囲気が良くてすぐに馴染めました。人生で初めて食べた馬刺しが本当に美味しくて感動！臭みが全くなくて、とろけるような食感でした。〆に頼んだ「やまやの明太子ご飯」がまた最高で、これだけでも食べに来たいくらいです。活気はあるけど騒がしすぎず、先輩方のアドバイスもしっかり聞くことができました。沖縄にいながら、九州の名物を色々楽しめるのは得した気分になりますね。ごちそうさまでした！`,
  },
  {
    userName: "高橋 信夫",
    email: "takahashi.nobuo@example.com",
    employeeNumber: "CA2007005",
    yearsOfService: 17,
    userType: "meister" as const,
    rating: 5,
    content: `部署の決起集会として、15名ほどで利用しました。ある程度の人数でも対応できるキャパシティがあり、掘りごたつの個室で一体感のある会になったのが良かったです。今回はコース料理をお願いしましたが、馬刺しや佐賀牛の炙り寿司といった名物もしっかり含まれており、ボリューム、質ともに満足のいく内容でした。若い社員は肉料理に、ベテラン勢は焼酎に合う珍味にと、世代を問わず楽しめるメニュー構成が素晴らしいと感じます。予約時の電話対応も非常に丁寧で、幹事としても安心して任せられました。また部署の集まりで使いたいと思います。`,
  },
  {
    userName: "渡辺 由美",
    email: "watanabe.yumi@example.com",
    employeeNumber: "CA2015006",
    yearsOfService: 9,
    userType: "normal" as const,
    rating: 4,
    content: `仕事帰りに同僚と二人でふらっと立ち寄りました。カウンター席があるのが良いですね。沖縄料理は普段からよく食べますが、たまに違うものが食べたい時に、ここの胡麻サバは最高です。新鮮なサバと特製の胡麻ダレが絡んで、お酒が進みます。芋焼酎の種類が豊富で、店員さんにおすすめを聞いたら、料理に合うものを丁寧に説明してくれて、とても好感が持てました。キャッシュレス決済の種類が多いのも、個人的に嬉しいポイント。サクッと飲んで帰るにも、じっくり語り合うにも使える、おもろまちの隠れ家的なお店です。`,
  },
  {
    userName: "伊藤 翔太",
    email: "ito.shota@example.com",
    employeeNumber: "CA2017007",
    yearsOfService: 7,
    userType: "normal" as const,
    rating: 5,
    content: `チームの懇親会で幹事を担当し、こちらのお店を選びました。オンライン予約が非常にスムーズで、ストレスなく手配できたのがまず良かったです。お目当ては、SNSで見て気になっていた「佐賀牛炙り寿司」。目の前で炙るパフォーマンスはやはり盛り上がりますね。味も香りも格別で、チームのテンションも一気に上がりました。IT系の人間としては、こうした「体験価値」を提供してくれるお店は刺さります。料理はどれも美味しく、ドリンクの提供スピードも速くて、会が終始スムーズに進行できました。参加者全員が満足してくれて、幹事として鼻が高かったです。`,
  },
  {
    userName: "中村 理恵",
    email: "nakamura.rie@example.com",
    employeeNumber: "CA2011008",
    yearsOfService: 13,
    userType: "normal" as const,
    rating: 5,
    content: `内定者との懇親会会場として、個室を予約しました。学生さんにとっては、沖縄料理はもちろん、九州の名物も一度に味わえる点が魅力に映るかと思い、こちらに決めました。結果は大正解。初めて食べるという「からし蓮根」のツーンとくる辛さに驚いたり、定番の「ゴーヤチャンプルー」に安心したりと、料理をきっかけに会話が弾みました。プライベートが保たれた空間で、内定者もリラックスしてくれた様子。社会人の先輩として、少しお洒落で美味しいお店を紹介でき、良い会になりました。お店の落ち着いた雰囲気も、フォーマルな場に適していると感じます。`,
  },
  {
    userName: "小林 正治",
    email: "kobayashi.masaharu@example.com",
    employeeNumber: "CA1999009",
    yearsOfService: 25,
    userType: "meister" as const,
    rating: 5,
    content: `重要なビジネスパートナーとの会食で、部下がセッティングしてくれたのがこのお店でした。正直、若い社員が使う居酒屋だろうと高を括っていましたが、良い意味で裏切られましたね。独自ルートで仕入れているという食材はどれも質が高く、特に馬刺しの霜降りは、都内の専門店にも引けを取らないレベルだと感じました。希少なプレミアム焼酎が置いてあったのも嬉しい驚きです。おもろまちというビジネスの中心地で、このクオリティの料理と落ち着いた個室空間を提供してくれるのは非常に価値がある。今後の会食の選択肢として、ぜひ覚えておきたい一軒です。`,
  },
  {
    userName: "松本 さくら",
    email: "matsumoto.sakura@example.com",
    employeeNumber: "CA2019010",
    yearsOfService: 5,
    userType: "normal" as const,
    rating: 5,
    content: `四半期目標の達成祝いで、チームメンバーと利用しました！ずっと来たかったお店なので、念願叶って嬉しかったです。掘りごたつ式の個室は足が楽で、リラックスできるのが最高。お目当ての馬刺し、佐賀牛炙り寿司、胡麻サバをみんなでシェアしましたが、どれも本当に美味しくて、あっという間になくなりました（笑）。お酒が飲めないメンバーもいるのですが、ノンアルコールのカクテルやソフトドリンクの種類も豊富で、全員が楽しめたのが良かったです。美味しい料理とお酒、そして最高の仲間。最高の達成会になりました！`,
  },
];

async function main() {
  console.log("🌱 九州うまかもん酒場 琉神のレビューを作成します...");

  const hashedPassword = await bcrypt.hash("password123", 10);
  
  // ショップを作成または取得
  const shop = await prisma.shop.upsert({
    where: { hotpepperShopId: RYUJIN_SHOP_ID },
    update: {},
    create: {
      hotpepperShopId: RYUJIN_SHOP_ID,
      visitCounter: 0,
    },
  });

  console.log("✅ ショップを準備しました:", shop.hotpepperShopId);

  // ユーザーとレビューを作成
  for (const review of reviews) {
    // ユーザーを作成または取得
    const user = await prisma.user.upsert({
      where: { email: review.email },
      update: {},
      create: {
        name: review.userName,
        email: review.email,
        employeeNumber: review.employeeNumber,
        yearsOfService: review.yearsOfService,
        password: hashedPassword,
        userType: review.userType,
      },
    });

    // レビューを作成
    const createdReview = await prisma.review.create({
      data: {
        userId: user.id,
        hotpepperShopId: RYUJIN_SHOP_ID,
        hotpepperShopName: "九州うまかもん酒場 琉神",
        content: review.content,
        rating: review.rating,
      },
    });

    console.log(`✅ ${user.name}さんのレビューを作成しました`);
  }

  // 訪問カウンターを更新（レビュー数に基づく仮の数値）
  await prisma.shop.update({
    where: { hotpepperShopId: RYUJIN_SHOP_ID },
    data: { visitCounter: reviews.length * 3 }, // 各レビュアーが平均3回訪問と仮定
  });

  console.log("🎉 レビューデータの作成が完了しました！");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ シードエラー:", e);
    await prisma.$disconnect();
    process.exit(1);
  });