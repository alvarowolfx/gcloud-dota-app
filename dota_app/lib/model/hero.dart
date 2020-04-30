class DotaHero {
  DotaHero({
    this.id,
    this.name,
    this.rank,
    this.matches,
    this.advantage,
    this.winRate,
    this.imageUrl,
    this.bestHeroes,
    this.worstHeroes,
  });

  String id;
  String name;
  String imageUrl;
  int rank;
  int matches;
  double advantage;
  double winRate;
  List<DotaHero> bestHeroes;
  List<DotaHero> worstHeroes;

  factory DotaHero.fromMap(Map value) {
    var bestHeroes = List<DotaHero>();
    var worstHeroes = List<DotaHero>();

    if (value['bestHeroes'] != null) {
      Map<String, dynamic> heroesMap = Map.from(value['bestHeroes']);
      //print('${value['name']} - ${heroesMap.keys.length}');
      heroesMap.keys.forEach((key) {
        var hero = DotaHero.fromMap(Map.from(heroesMap[key]));
        bestHeroes.add(hero);
      });
      //print('${value['name']} - ${bestHeroes.length}');
    }

    if (value['worstHeroes'] != null) {
      Map<String, dynamic> heroesMap = Map.from(value['worstHeroes']);
      heroesMap.keys.forEach((key) {
        var hero = DotaHero.fromMap(Map.from(heroesMap[key]));
        worstHeroes.add(hero);
      });
    }

    return DotaHero(
      id: value['id'],
      name: value['name'],
      rank: value['rank'],
      winRate: (value['winRate'] + .0),
      matches: value['matches'] ?? 0,
      advantage: (value['advantage'] == null ? 0 : value['advantage'] + .0),
      imageUrl: value['imageUrl'],
      bestHeroes: bestHeroes,
      worstHeroes: worstHeroes,
    );
  }
}
